import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Keyboard, ListRenderItem, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { SearchStackProps } from "../components/type";
import { Ionicons } from "@expo/vector-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import DismissKeyboard from "../components/DismissKeyboard";
import { gql, useLazyQuery } from "@apollo/client";
import { searchPhotos, searchPhotosVariables, searchPhotos_searchPhotos } from "../__generated__/searchPhotos";

const Container = styled.View`
  background-color: black;
  flex:1;
`;
const Text = styled.Text`
  color: white;
`;
const Button = styled.TouchableOpacity`

`;
const HeaderSearch = styled.View<{width:number}>`
  background-color: rgba(255,255,255,0.8);
  padding: 10px 10px;
  border-radius: 25px;
  /* width: 200px; */
  flex-direction: row;
  align-items: center;
  width: ${props=>props.width-30}px;
`;
const HeaderInput = styled.TextInput`
  font-size: 20px;
  width: 80%;
`;
const MessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  /* background-color: red; */
`;
const MessageText = styled.Text`
  color: white;
  font-weight: 600;
  margin-top: 10px;
`;
const Img = styled.Image`
  width: ${props=>props.width}px;
  height: ${props=>props.width}px;
`;

const SEARCH_PHOTO_QUERY = gql`
  query searchPhotos( $keyword: String! ){
    searchPhotos( keyword:$keyword ){
      id
      file
    }
  }
`;

const SEARCH_USER_QUERY = gql`
  query searchUsers($keyword: String!,$last: Int,$page: Int) {
    searchUsers(keyword: $keyword,last: $last,page: $page) {
      users {
        userName
        avatar
      }
    }
  }

`;

type Props = NativeStackScreenProps<SearchStackProps, 'Search'>;
type FormType = {
  keyword: string;
}

const Search = ({navigation:{navigate,setOptions},route}:Props) => {
  const {setValue,register,handleSubmit} = useForm<FormType>();
  const [startQueryFn, {loading, data, called}] = useLazyQuery<searchPhotos,searchPhotosVariables>(SEARCH_PHOTO_QUERY);
  const {width} = useWindowDimensions();
  const onVaild:SubmitHandler<FormType> = ({keyword}) => {
    startQueryFn({
      variables:{
        keyword
      }
    })
  }
  // const onSubmit = () => {
  //   if(loading) return;
  //   const keyword = getValues().keyword
  //   if (!keyword) return;
  //   startQueryFn({
  //     variables:{
  //       keyword
  //     }
  //   })
  // }
  useEffect(()=>{
    setOptions({
      headerTitle:() => <HeaderSearch width={width}>
        <TouchableOpacity onPress={handleSubmit(onVaild)}>
          <Ionicons name="search" size={30} />
        </TouchableOpacity>
        <HeaderInput
          placeholder="Search User"
          placeholderTextColor="rgba(0,0,0,0.3)"
          autoCapitalize="none"
          returnKeyType="search"
          onChangeText={text => setValue("keyword",text)}
          autoCorrect={false}
          onSubmitEditing={handleSubmit(onVaild)}
        />
      </HeaderSearch>
    });
    register("keyword",{
      required:true,
      minLength:3,
    });
  },[])
  // console.log(data);
  const renderItem:ListRenderItem<searchPhotos_searchPhotos|null >|null = ({item:photo}) => {
    if(photo?.file && photo.id) {
    return (
      <TouchableOpacity onPress={()=>navigate("Photo", {photoId: photo.id})}>
        <Img source={{uri:photo.file}} width={width/3} />
        {/* <Image source={{uri:photo.file}} style={{width:width/3}} height={width/3} /> */}
      </TouchableOpacity>
    )}
    return null;
  }
  return <DismissKeyboard>
    <Container>
    {loading? <MessageContainer>
        <ActivityIndicator size="large"/>
        <MessageText>Searching...</MessageText>
      </MessageContainer> : null
    }
    {!called?<MessageContainer>
      <MessageText>Search by keyword</MessageText>
    </MessageContainer>:null}
    {data?.searchPhotos !== undefined ? (
      data?.searchPhotos?.length === 0 ? (
        <MessageContainer>
          <MessageText>Could not find anything</MessageText>
        </MessageContainer>
        ) : (
        <FlatList
          data={data?.searchPhotos}
          keyExtractor={(item)=>item?.id + ""}
          renderItem={renderItem}
          numColumns={3}
        /> )
      ) : null}
    </Container>
  </DismissKeyboard>;
}
export default Search;