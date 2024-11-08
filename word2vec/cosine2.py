import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load the pre-trained Word2Vec model
model = api.load("word2vec-google-news-300")

import re

def preprocess(text):
    # Tokenize and remove non-alphanumeric characters
    words = re.findall(r'\b\w+\b', text.lower())
    return [word for word in words if word in model.key_to_index]  # Keep only words in vocabulary

def get_average_vector(words):
    # Get embeddings for each word and calculate the average
    word_vectors = [model[word] for word in words if word in model.key_to_index]
    if word_vectors:
        return np.mean(word_vectors, axis=0)
    else:
        return np.zeros(model.vector_size)

def calculate_relevancy(content, focus_points):
    # Preprocess and get embeddings
    content_words = preprocess(content)
    content_vector = get_average_vector(content_words)
    
    relevancy_scores = {}
    for focus_point in focus_points:
        focus_words = preprocess(focus_point)
        focus_vector = get_average_vector(focus_words)
        
        # Calculate cosine similarity
        similarity_score = cosine_similarity([content_vector], [focus_vector])[0][0]
        relevance_percentage = similarity_score * 100  # Convert to percentage
        relevancy_scores[focus_point] = relevance_percentage
    
    return relevancy_scores

# Example usage
content = ''' Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA),[16] meaning that compiled Java code can run on all platforms that support Java without the need to recompile.[17] Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of the underlying computer architecture. The syntax of Java is similar to C and C++, but has fewer low-level facilities than either of them. The Java runtime provides dynamic capabilities (such as reflection and runtime code modification) that are typically not available in traditional compiled languages.

Java gained popularity shortly after its release, and has been a very popular programming language since then.[18] Java was the third most popular programming language in 2022 according to GitHub.[19] Although still widely popular, there has been a gradual decline in use of Java in recent years with other languages using JVM gaining popularity.[20]

Java was originally developed by James Gosling at Sun Microsystems. It was released in May 1995 as a core component of Sun's Java platform. The original and reference implementation Java compilers, virtual machines, and class libraries were originally released by Sun under proprietary licenses. As of May 2007, in compliance with the specifications of the Java Community Process, Sun had relicensed most of its Java technologies under the GPL-2.0-only license. Oracle offers its own HotSpot Java Virtual Machine, however the official reference implementation is the OpenJDK JVM which is free open-source software and used by most developers and is the default JVM for almost all Linux distributions.  '''
focus_points = ["Java", "Programming", "Jupiter"]

relevancy = calculate_relevancy(content, focus_points)
print(relevancy)
