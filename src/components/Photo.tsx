import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { seeFeed_seeFeed, seeFeed_seeFeed_user } from "../__generated__/seeFeed";
import { FeedStackProps } from "./type";
import { Ionicons } from "@expo/vector-icons";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { toggleLike, toggleLikeVariables } from "../__generated__/toggleLike";

const Container = styled.View`

`;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
type ImageProp = {
  width:number;
  height:number;
}
const File = styled.Image<ImageProp>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 8px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike ($id:Int!) {
    toggleLike (id:$id){
      ok
      error
    }
  }
`;

interface IPhotoProps {
  id: number;
  user: seeFeed_seeFeed_user;
  file: string;
  caption: string | null;
  likes: number;
  isLiked: boolean;
}

// React.FC<seeFeed_seeFeed | undefined>
const Photo: React.FC<IPhotoProps> = ({id,user,caption,file,isLiked,likes}) => {
  const {width:getWidth} = useWindowDimensions();
  const [height,setHeight] = useState(getWidth)
  useEffect(()=>{
    Image.getSize(file,(width,height)=>setHeight(getWidth*height/width),(error)=>console.error(error))
  },[file])
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackProps, "Photo">>()

  const updateToggleLike: MutationUpdaterFunction<toggleLike,toggleLikeVariables, DefaultContext, ApolloCache<any>>= (cache,result) => {
    const ok = result.data?.toggleLike?.ok;
    if(ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id:photoId,
        fields:{
          isLiked(prev) {
            return !prev
          },
          likes(prev) {
            return isLiked ? prev-1 : prev+1
          }
        }
      })
    }
    
  }

  const [toggleLikeMutation] = useMutation<toggleLike,toggleLikeVariables>(TOGGLE_LIKE_MUTATION,{
    variables:{
      id
    },
    update:updateToggleLike
  });
  const updateToggleLikes = () => {
    toggleLikeMutation();
  }
  const goToProfile = () => navigation.navigate("Profile",{id:user.id,userName:user.userName})
  return <Container>
    <Header onPress={goToProfile}>
      {user.avatar && <UserAvatar source={{uri:user.avatar}} resizeMode="cover"/>}
      <Username>{user.userName}</Username>
    </Header>
      {file !== "" && <File source={{uri:file}} width={getWidth} height={height} resizeMode="contain"/>}
    <ExtraContainer>
      <Actions>
        <Action onPress={updateToggleLikes}>
          <Ionicons name={isLiked?"heart":"heart-outline"} color={isLiked?"tomato":"white"} size={22}/>
        </Action>
        <Action onPress={() => navigation.navigate("Comments")}>
          <Ionicons name="chatbubble-outline" color="white" size={20}/>
        </Action>
      </Actions>


      <TouchableOpacity onPress={() => navigation.navigate("Likes",{photoId:id})}>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
      </TouchableOpacity>


      <Caption>
        <TouchableOpacity onPress={goToProfile}><Username>{user.userName}{file && "a"}</Username></TouchableOpacity>
        <CaptionText>{caption}</CaptionText>
      </Caption>
    </ExtraContainer>
  </Container>; 
}
export default Photo;