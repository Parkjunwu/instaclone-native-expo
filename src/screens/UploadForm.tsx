import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { colors } from "../color";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { uploadPhoto, uploadPhotoVariables } from "../__generated__/uploadPhoto";

const PHOTO_FRAGMENT = gql`
  fragment PhotoFragment on Photo {
    id
    file
    likes
    commentNumber
    isLiked
  }
`;
const FEED_PHOTO = gql`
   fragment FeedPhoto on Photo {
     ...PhotoFragment
     user {
       id
       userName
       avatar
     }
     caption
     createdAt
     isMine
   }
   ${PHOTO_FRAGMENT}
 `;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption){
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 40px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;
const HeaderRightText = styled.Text`
  color:${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};
type NativeStackParamList = {
  Tabs:NavigatorScreenParams<TabParamList>;
  Upload:undefined;
  UploadForm:{file:string};
};
type Props = NativeStackScreenProps<NativeStackParamList,"UploadForm">
interface IForm {
  caption: string;
}

const UploadForm = ({navigation,route}:Props) => {
  const updateUploadPhoto:MutationUpdaterFunction<any, uploadPhotoVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const {data:{uploadPhoto}} = result;
    if(uploadPhoto.id) {
      cache.modify({
        id:"ROOT_QUERY",
        fields:{
          seeFeed(prev){
            return [uploadPhoto,...prev]
          }
        }
      })
      navigation.navigate("FeedTab")
    }
  }
  const [uploadPhotoMutation,{loading,data}] = useMutation<uploadPhoto,uploadPhotoVariables>(UPLOAD_PHOTO_MUTATION,{
    update:updateUploadPhoto
  })
  const {register,handleSubmit,setValue} = useForm<IForm>();
  useEffect(() => {
    register("caption",{
      required:true,
    });
    // register("file",{
    //   required:true,
    // });
  },[register]);
  const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>
  const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>
  useEffect(() => {
    navigation.setOptions({
      title:"Upload",
      headerStyle:{
        backgroundColor:"black"
      },
      headerTintColor:"white",
      // headerBackImageSource:{uri:"https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Gtk-go-back-ltr.svg/120px-Gtk-go-back-ltr.svg.png"}

      headerLeft:({tintColor}) => loading ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="close" color={tintColor} size={30} />
      </TouchableOpacity>,
      headerRight:loading ? HeaderRightLoading : HeaderRight,
    });
  },[loading])
  const uri = route.params.file;
  const onValid = ({caption}:IForm) => {
    const file = new ReactNativeFile({
      uri,
      name: "1.jpg",
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables:{
        caption,
        file,
      }
    })
  }
  return (
    <DismissKeyboard>
      <Container>
        {uri !== "" && <Photo source={{uri}} resizeMode="contain" />}
        <CaptionContainer>
          <Caption
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            onChangeText={(text)=>setValue("caption",text)}
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
}
export default UploadForm;