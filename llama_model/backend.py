from flask import Flask, request, jsonify
from fetch_response import get_response  

app = Flask(__name__)

@app.route('/get_response', methods=['POST'])
def get_focus_response():
    data = request.json
    print("data")
    print(data)
    focus_topic_1 = data.get('focusPoints')[0]
    focus_point_2 = data.get('focusPoints')[1]
    focus_point_3 = data.get('focusPoints')[2]
    print(data.get('focusPoints'))
    content = data.get('content')[:4000]

    response = get_response(focus_topic_1, focus_point_2, focus_point_3, content)
    print("Response")
    print(response)
    return jsonify(response) 

if __name__ == '__main__':
    app.run(port=5000)  
