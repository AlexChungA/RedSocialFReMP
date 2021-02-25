import requests
import json
import operator

url = "https://api.luxand.cloud/photo/emotions"

def predict_emotion(image_from_web):
    emotions={'happiness':"feliz", 'sadness':"triste", 'disgust':"disgustado", 'anger':"molesto", 'contempt':'desprecio', 'fear':"asustado", 'neutral':"neutral",'surprise':"sorprendido"}
    image_from_web = image_from_web.split(',')[1]
    payload = {}
    headers = { 'token': "1501a94aaac646d9b16619c09e037a1e" }
    payload["photo"] = image_from_web
    response = json.loads(requests.request("POST", url, data=payload, headers=headers).text)
    emotions_from_api = response["faces"][0]["emotions"]
    emotion = max(emotions_from_api.items(), key=operator.itemgetter(1))[0]
    return emotions[emotion]