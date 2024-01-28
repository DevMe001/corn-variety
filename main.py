import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt
import cv2
import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Annotated
import base64
from PIL import Image
from io import BytesIO
import re


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def welcome():

    return {
        'message': 'Welcome Herfsdfsdfsde'
    }
    

@app.get("/my-first-api")
def hello(name = None):

    if name is None:
        text = 'Hello!'

    else:
        text = 'Hello ' + name + '!'

    return text

@app.get('/send-picture')
async def detect_image():
    savedModel = load_model('corn_variety_model.h5')
    image_path = 'Dataset/train/Syngenta NK-6410/IMG20230926160905.jpg'
    
    input_image = await preprocess_image(image_path)
    predictions = savedModel.predict(input_image)
    predicted_class = np.argmax(predictions[0])
    varieties = ['Dekalb 6919', 'Pioneer 3585', 'Syngenta NK-6410', 'Unknown']
    predicted_variety = varieties[predicted_class]
    text = predicted_variety

    return text

@app.post('/name/sample')
async def write_name(body: dict) -> dict:
    
    return {
        'message': body['name']
    }

@app.post('/upload-image')
async def upload(body: dict) -> dict:
    savedModel = load_model('corn_variety_model.h5')
    filedata = body['filedata']
    new_data = re.sub('^data:image/.+;base64,', '', filedata)
    input_image = await process_image(new_data)
    predictions = savedModel.predict(input_image)
    predicted_class = np.argmax(predictions[0])
    varieties = ['Dekalb 6919', 'Pioneer 3585', 'Syngenta NK-6410', 'Unknown']
    predicted_variety = varieties[predicted_class]
    text = predicted_variety

    return {
            'message': "Here is the predicted variety...",
            'variety': text
        } 

def readb64(base64_string):
    pimg = Image.open(BytesIO(base64.b64decode(base64_string)))
    return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

async def process_image(image_data):
    img_width, img_height = 150, 150
    img = readb64(image_data)
    img = cv2.resize(img, (img_width, img_height))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0) 
    return img

async def preprocess_image(image_path):
    model = tf.keras.Model()
    img_width, img_height = 150, 150

    if not os.path.exists(image_path):
        raise ValueError(f"Image not found at the provided path: {image_path}")
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Image could not be read: {image_path}")
    if img.size == 0:
        raise ValueError(f"Empty image: {image_path}")
    img = cv2.resize(img, (img_width, img_height))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0) 
    return img