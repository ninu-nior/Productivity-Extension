import numpy as np
import gensim.downloader as api
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import cosine_similarity

model = api.load("word2vec-google-news-300")

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab') 
stop_words = set(stopwords.words('english'))

def preprocess(text):
    tokens = word_tokenize(text.lower())
    tokens = [word for word in tokens if word not in stop_words and word.isalpha()]
    return tokens

def get_average_vector(words):
    vectors = []
    for word in words:
        if word in model.key_to_index:  
            vectors.append(model[word])
    if len(vectors) == 0:
        return np.zeros(model.vector_size)  
    return np.mean(vectors, axis=0)

def calculate_similarity(content, focus_points):
    content_tokens = preprocess(content)
    content_vector = get_average_vector(content_tokens)
    
    similarities = []
    for topic in focus_points:
        topic_tokens = preprocess(topic)
        topic_vector = get_average_vector(topic_tokens)
        
        similarity = cosine_similarity([content_vector], [topic_vector])
        similarities.append(similarity[0][0]) 
        
    return similarities

def calculate_relevancy_percentage(similarities):
    relevancy_percentages = [similarity * 100 for similarity in similarities]
    return relevancy_percentages

content = ''' Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA),[16] meaning that compiled Java code can run on all platforms that support Java without the need to recompile.[17] Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but has fewer low-level facilities than either of them. The Java runtime provides dynamic capabilities (such as reflection and runtime code modification) that are typically not available in traditional compiled languages.'''
focus_points = ["Java", "Programming", "Jupiter"]
