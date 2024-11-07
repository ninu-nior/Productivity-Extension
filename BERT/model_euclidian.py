from transformers import BertTokenizer, BertModel
import torch
import numpy as np
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")

def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.numpy().flatten()

def calculate_euclidean_distance(vec1, vec2):
    return np.linalg.norm(vec1 - vec2)

def calculate_similarity(content, focus_points):
    content_vector = get_bert_embedding(content)
    
    distances = []
    for topic in focus_points:
        topic_vector = get_bert_embedding(topic)
        distance = calculate_euclidean_distance(content_vector, topic_vector)
        distances.append(distance)
        
    return distances

def calculate_relevancy_percentage(distances):
    max_distance = max(distances) if distances else 1
    relevancy_percentages = [(1 - (dist / max_distance)) * 100 for dist in distances]
    return relevancy_percentages

content = """Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible."""
focus_points = ["Java", "Programming", "Jupiter"]
distances = calculate_similarity(content, focus_points)
relevancy_percentages = calculate_relevancy_percentage(distances)

response = {
    f"focus_point_{i+1}_percentage": relevancy_percentages[i]
    for i in range(len(focus_points))
}
response["message"] = "Relevancy scores successfully calculated using BERT and Euclidean distance"

print(response)

