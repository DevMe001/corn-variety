import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet, Text, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerFunction() {
    const [image, setImage] = useState(null);
    const [varietyName, setVarietyName] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if ( !result.canceled ) {
          setImage(result.assets[0].uri);
        }
    };

    const getCornVariety = async () => {
        // const blob = b64toBlob(image);
        // const imageType = blob.type;
        // const splitType = imageType.split("/");
        // const getType = splitType[1];
        // const fileName = 'myImage.' + getType;
        // let result = await fetch(`http://localhost:8000/upload-image`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({"filename": fileName, "filedata": image})
        // })
        // let data = await result.json();
    
        // console.log(data);
    
        setVarietyName('Not yet connected to API!');
        // if ( data ) {
        // }
    };

    function b64toBlob(dataURI) {
    
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }
}



