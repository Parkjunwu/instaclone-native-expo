import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { FeedStackProps } from "../components/type";

const Container = styled.View`
  background-color: black;
  flex:1;
  align-items: center;
  justify-content: center;
`;
const Text = styled.Text`
  color: white;
`;
type Props = NativeStackScreenProps<FeedStackProps, 'Profile'>;

const Profile = ({navigation, route}:Props) => {
  useEffect(()=>{
    if(route?.params?.userName) {
      navigation.setOptions({
        title:route.params.userName,
      })
    }
  },[])
  return <Container>
    <Text>Someone's Profile</Text>
    <Image source={{uri:"https://instaclone-s-upload.s3.amazonaws.com/upload/21-1641810945808-3.jpeg"}} style={{width:100,height:100}}/>
    <Image source={{uri:"https://instaclone-s-upload.s3.amazonaws.com/upload/21-1642244747955-IMG_8931s.jpg"}} style={{width:100,height:100}}/>

    
  </Container>;
}
export default Profile;