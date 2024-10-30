from flask import Flask, request, jsonify
from fetch_response import get_response  # Import your function

app = Flask(__name__)

@app.route('/get_response', methods=['POST'])
def get_focus_response():
    data = request.json
    focus_topic_1 = data.get('focus_topic_1')
    focus_point_2 = data.get('focus_point_2')
    focus_point_3 = data.get('focus_point_3')
    content = data.get('content')

    response = get_response(focus_topic_1, focus_point_2, focus_point_3, content)

    return jsonify(response)  # Return the response from the model

if __name__ == '__main__':
    app.run(port=5000)  # Run your Flask app
