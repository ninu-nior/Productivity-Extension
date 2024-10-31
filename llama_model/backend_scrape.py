from langchain.document_loaders import WebBaseLoader
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/extract-content', methods=['POST'])
def extract_content():
    data = request.json
    url = data.get('url')
    
    if url:
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            # Assuming the first document is the main content
            content = docs[0].page_content
            return jsonify({"status": "success", "content": content})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
    else:
        return jsonify({"status": "error", "message": "No URL provided"})

if __name__ == "__main__":
    app.run(port=5000)
