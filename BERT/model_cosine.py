from transformers import BertTokenizer, BertModel
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertModel.from_pretrained("bert-base-uncased")

def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.numpy().flatten()

def calculate_similarity(content, focus_points):
    content_vector = get_bert_embedding(content)
    
    similarities = []
    for topic in focus_points:
        topic_vector = get_bert_embedding(topic)
        similarity = cosine_similarity([content_vector], [topic_vector])
        similarities.append(similarity[0][0])  # Extract the similarity score
        
    return similarities

def calculate_relevancy_percentage(similarities):
    relevancy_percentages = [similarity * 100 for similarity in similarities]
    return relevancy_percentages


content = ''' Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA),[16] meaning that compiled Java code can run on all platforms that support Java without the need to recompile.[17] Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but has fewer low-level facilities than either of them. The Java runtime provides dynamic capabilities (such as reflection and runtime code modification) that are typically not available in traditional compiled languages.'''
focus_points = ["Java", "Programming", "Jupiter"]

similarities = calculate_similarity(content, focus_points)
relevancy_percentages = calculate_relevancy_percentage(similarities)

#print("Similarity scores:", similarities)
print("Relevancy percentages:", relevancy_percentages)
