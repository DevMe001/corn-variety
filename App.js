import React, { useState, useEffect } from 'react';
import { Pressable, Button, Image, View, Platform, StyleSheet, Text, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Spacer, Container, LogoBox } from './components';
import * as NavigationBar from 'expo-navigation-bar';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const visibility = NavigationBar.useVisibility()
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
      setVarietyName('Verifying...');
      setTimeout(() => {
        getCornVariety();
      }, 5000);
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
      setVarietyName('Verifying...');
      setTimeout(() => {
        getCornVariety();
      }, 5000);
    }
  };

  const getCornVariety = async () => {
    const blob = b64toBlob(image);
    const imageType = blob.type;
    const splitType = imageType.split("/");
    const getType = splitType[1];
    const fileName = 'myImage.' + getType;
    let result = await fetch(`http://localhost:8000/upload-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"filename": fileName, "filedata": image})
    })
    let data = await result.json();

    console.log(data);

    
    if ( data ) {
      setVarietyName(data ['variety']);
     }
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

  return (
		<Container style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			{/* <Text style={{ fontSize: '2.25rem', textAlign: 'center', fontWeight: '700', color: '#222423' }}>CORN VARIETY</Text> */}
			<Pressable onPress={getCornVariety}>
				<Text style={{ fontSize: 12, color: '#a1a1a1' }}>about this app</Text>
			</Pressable>
			<Spacer size={6} />
			<LogoBox />
			<Spacer size={24} />
			<View style={{ width: 250 }}>
				<View style={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
					<Pressable style={{ padding: 10, borderColor: '#88d450', borderStyle: 'solid', borderWidth: 3, maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 8, flexGrow: 1 }} onPress={pickImage}>
						<Entypo name='upload' size={64} color='#88d450' />
						<Text style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 600, color: '#303030' }}>Upload an Image</Text>
					</Pressable>
					<Pressable style={{ padding: 10, borderColor: '#f37521', borderStyle: 'solid', borderWidth: 3, maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 8, flexGrow: 1 }} onPress={openCamera}>
						<AntDesign name='camera' size={64} color='#f37521' />
						<Text style={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 600, color: '#303030' }}>Capture an Image</Text>
					</Pressable>
				</View>
				<Spacer size={16} />

				{varietyName && (
					<>
						<Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: '600', color: '#303030' }}>Variety: {varietyName}</Text>
					</>
				)}
			</View>

			<View style={styles.container}>
				<Image source={image} style={styles.image} />
			</View>
		</Container>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 300, // Set the width here
		height: 300, // Set the height here
	},
});
