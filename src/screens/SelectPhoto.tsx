import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from 'expo-media-library';
import { FlatList, Image, ListRenderItem, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../color";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Container = styled.View`
  flex:1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;
const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const HeaderRightText = styled.Text`
  color:${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

type INavProps = {
  Select: undefined;
  // Upload: {photoUri:string};
  UploadForm: {file:string};
}
type Props = NativeStackScreenProps<INavProps, 'Select'>;

const SelectPhoto = ({navigation}:Props) => {
  const [ok,setOk] = useState(false);
  const [photos,setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [chosenPhoto,setChosenPhoto] = useState("");
  const [chosenPhotoAsset,setChosenPhotoAsset] = useState<MediaLibrary.Asset|null>(null);
  
  // console.log(photos)
  // console.log(chosenPhoto)

  const getPhotos = async() => {
    const {assets:photos} = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
    setChosenPhotoAsset(photos[0]);
  }
  const getPermissions = async () => {
    const {status,canAskAgain} = await MediaLibrary.getPermissionsAsync();
    if(status === "undetermined" && canAskAgain === true ) {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status !== "undetermined") {
        setOk(true);
        getPhotos();
      }
    } else if (status !== "undetermined") {
      setOk(true);
      getPhotos();
    }
  }
  
  const HeaderRight = () => <TouchableOpacity onPress={async()=>{
    if(chosenPhotoAsset){
    const {localUri} = await MediaLibrary.getAssetInfoAsync(chosenPhotoAsset);
    navigation.navigate("UploadForm",{file:localUri})}
  }}>
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>

  useEffect(()=>{
    getPermissions();
  },[ok])
  
  useEffect(()=>{
    navigation.setOptions({
      headerRight:HeaderRight,
    });
  },[chosenPhoto])
  // const [checkedArr,setCheckedArr] = useState<any>({});
  // console.log(checkedArr)
  // onPress={() => setCheckedArr(prev => {
  //   const addObj = {[photoId]:true}
  //   const bool = true
  //   if (checkedArr[photoId] === true) {
  //     const {[photoId]:bool,...empty} = checkedArr; 
  //     // return {...prev,[photoId]:false}
  //     return empty
  //   }
  //   return {...prev,...addObj}
  //   })}
  {/* <Ionicons name={checkedArr[photoId] ?"checkmark-circle":"checkmark-circle-outline"} color={checkedArr[photoId] ? "rgb(155,253,51)": "white"} size={20}/> */}
  const numColumns = 3;
  const {width} = useWindowDimensions();
  const imageWidth = width/numColumns;
  const choosePhoto = (file:MediaLibrary.Asset) => {
    setChosenPhoto(file.uri);
    setChosenPhotoAsset(file);
  };
  // console.log(chosenPhoto)
  // console.log("select")
  const renderItem: ListRenderItem<MediaLibrary.Asset> = ({item:photo}) => {
    return <ImageContainer onPress={()=>choosePhoto(photo)} >
        {photo.uri !== "" && <Image source={{uri:photo.uri}} style={{width:imageWidth,height:imageWidth}}/>}
        <IconContainer>
          <Ionicons name={chosenPhoto === photo.uri? "checkmark-circle":"checkmark-circle-outline"} color={chosenPhoto === photo.uri? colors.blue : "white"} size={20}/>
        </IconContainer>
      </ImageContainer>
  }
  return (
    <Container>
      <Top>
        {chosenPhoto !== "" && <Image source={{uri:chosenPhoto}} style={{width:"100%",height:"100%"}}/>}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id+""}
          renderItem={renderItem}
          numColumns={numColumns}
        />
      </Bottom>
    </Container>
  )
};

export default SelectPhoto;