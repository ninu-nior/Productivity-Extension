from flask import Flask, request, jsonify
from cosine import calculate_similarity, calculate_relevancy_percentage
app = Flask(__name__)

@app.route('/get_response', methods=['POST'])
def get_focus_response():
    data = request.json
    print("data")
    print(data)
    focus_points = data.get('focusPoints')
    content = data.get('content')
    print(data.get('focusPoints'))
    similarities = calculate_similarity(content, focus_points)
    relevancy_percentages = calculate_relevancy_percentage(similarities)
    response = {
        f"focus_point_{i+1}_percentage": relevancy_percentages[i]
        for i in range(len(focus_points))
    }
    response["message"] = "Relevancy scores calculated using cosine similarity"
    print(response)
    return jsonify(response)
    
if __name__ == '__main__':
    app.run(port=5000)  
