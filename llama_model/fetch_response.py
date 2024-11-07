import os
from langchain_groq import ChatGroq
import json
def get_response(focus_topic_1,focus_point_2,focus_point_3,content):
    
    llm = ChatGroq(
        model="llama-3.1-70b-versatile",
        groq_api_key="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",
        temperature=0,
    )
    prompt=f'''
    Imagine you are a productivity checker, i will give you 3 focus points and user webpage content(some of it), could you tell by how much percent is the content related to every focus points,. also give a short encouraging message to user relating to the content, NO PREAMBLE, Give the answer in the given JSON format, your response should only return JSON and nothing else.

    {{
        "focus_point_1_percentage":NUMBER,
        "focus_point_2_percentage":NUMBER,
        "focus_point_3_percentage":NUMBER,
        "message":STRING
    }}
    This is the only json format you return.

    focus_topic_1={focus_topic_1}
    focus_point_2={focus_point_2}
    focus_point_3={focus_point_3}
    Here is the content:{content}

    '''
    response=llm.invoke(prompt)
    response= json.loads(response.content)
    return response

