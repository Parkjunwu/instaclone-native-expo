import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StatusBar, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import {Ionicons} from "@expo/vector-icons"
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from "@react-navigation/native";


const Container = styled.View`
  flex:1;
  background-color: black;
`;
const Action = styled.View`
  flex: 0.3;
  align-items: center;
  justify-content: space-around;
  padding: 0px 50px;
`;
const ButtonsContainer = styled.View`
flex-direction: row;
width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: rgba(255,255,255,0.5);
  border-radius: 50px;
  opacity: 0.5;
  border: 7px solid rgba(255,255,255,0.8);
`;
const SliderContainer = styled.View`
  /* flex: 1; */
`;
const ActionsContainer = styled.View`
  flex-direction: row;
`;
const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  margin-left: 20px;
`;
const PhotoAction = styled.TouchableOpacity`
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;
const PhotoActionText = styled.Text`
  font-weight: 600;
`;
type INavProps = {
  Tabs: undefined;
  TakePhoto: {photoUri:string};
  UploadForm: {file:string};
}
type Props = NativeStackScreenProps<INavProps, 'TakePhoto'>;

const TakePhoto = ({navigation}:Props) => {
  const camera = useRef<Camera>();
  const [takenPhoto,setTakenPhoto] = useState("");
  const [cameraReady,setCameraReady] = useState(false);
  const [ok,setOk] = useState(false);
  const [cameraType,setCameraType] = useState(Camera.Constants.Type.back)
  const [zoom,setZoom] = useState(0);
  const [flashMode,setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const getPermissions = async() => {
    const {granted} = await Camera.requestCameraPermissionsAsync();
    setOk(granted);
  };
  useEffect(()=>{
    getPermissions();
  },[]);
  const onCameraSwitch = () => {
    setCameraType(prev => {
      if(prev === Camera.Constants.Type.back) {
        return Camera.Constants.Type.front
      };
      return Camera.Constants.Type.back;
    });
  };
  const onZoomValueChange = (e:number) => {
    setZoom(e)
  }
  const onFlashChange = () => {
    if(flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on)
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashMode(Camera.Constants.FlashMode.auto)
    } else {
      setFlashMode(Camera.Constants.FlashMode.off)
    }
  }
  const onCameraReady = () => setCameraReady(true)
  const takePhoto = async() => {
    if(camera.current && cameraReady) {
      const {uri} = await camera.current.takePictureAsync({
        quality:1,
        exif:true,
        skipProcessing:true,
      });
      setTakenPhoto(uri);
      // const assets = await MediaLibrary.createAssetAsync(uri);
      // console.log(assets)
    }
  }
  const onDismiss = () => setTakenPhoto("")
  const goToUpload = async(save:boolean) => {
    if(save){
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    navigation.navigate("UploadForm",{file:takenPhoto})
  }
  const onUpload = () => {
    Alert.alert("Save photo?", "Save photo & upload or just upload",[
      {
        text:"Save & Upload",
        onPress:()=>goToUpload(true),
      },
      {
        text:"just Upload",
        onPress:()=>goToUpload(false),
      },
      {
        text:"cancel",
      }
    ])
  }
  const isFocused = useIsFocused();
  // const cameraState = takenPhoto === "" && isFocused
  //// permission denied 일 때 재요청 버튼 만들기
  return (
    <Container>
      {isFocused && <StatusBar hidden={true} />}
      {takenPhoto === "" && isFocused ? <Camera 
        type={cameraType}
        zoom={zoom}
        flashMode={flashMode}
        style={{flex:1}}
        ref={camera}
        onCameraReady={onCameraReady}
        
      >
        <CloseButton onPress={()=>navigation.navigate("Tabs")}>
          <Ionicons name="close" color="white" size={30} />
        </CloseButton>
      </Camera> : takenPhoto !== "" && <Image source={{uri:takenPhoto}} style={{flex:1}}/>
      }
      {takenPhoto === "" ?<Action>
        <SliderContainer>
          <Slider
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255,255,255,0.5)"
            onValueChange={onZoomValueChange}
          />
        </SliderContainer>
        <ButtonsContainer>
          <TakePhotoBtn onPress={takePhoto}/>
          <ActionsContainer>
            <TouchableOpacity onPress={onFlashChange} style={{marginRight:30}}>
              <Ionicons name={flashMode === Camera.Constants.FlashMode.on?"flash" : flashMode === Camera.Constants.FlashMode.off ? "flash-off": "eye"} size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCameraSwitch}>
              <Ionicons name="camera-reverse" size={35} color="white" />
            </TouchableOpacity>
          </ActionsContainer>
        </ButtonsContainer>
      </Action> : <Action>
        <PhotoAction onPress={onDismiss}>
          <PhotoActionText>Dismiss</PhotoActionText>  
        </PhotoAction>  
        <PhotoAction onPress={onUpload}>
          <PhotoActionText>Upload</PhotoActionText>  
        </PhotoAction>
      </Action>}
    </Container>
  );
};

export default TakePhoto;
