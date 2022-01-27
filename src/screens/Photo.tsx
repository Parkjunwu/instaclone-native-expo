import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import styled from "styled-components/native";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { SearchStackProps } from "../components/type";
import { seePhoto, seePhotoVariables } from "../__generated__/seePhoto";

const Container = styled.ScrollView`
  /* background-color: black; */
`;

const SEE_PHOTO = gql`
  query seePhoto($id: Int!){
    seePhoto(id: $id) {
      id
      user {
        id
        userName
        avatar
      }
      hashTags{
        id
        hashTag
      }
      file
      caption
      createdAt
      likes
      commentNumber
      isMine
      isLiked
    }
  }

`;

type Props = NativeStackScreenProps<SearchStackProps, 'Photo'>;

const PhotoScreen = ({navigation,route}:Props) => {
  const {data,loading,refetch} = useQuery<seePhoto,seePhotoVariables>(SEE_PHOTO,{
    variables:{
      id:route?.params?.photoId
    },
  });
  const [refreshing,onRefreshing] = useState(false);
  const onRefresh = async() => {
    onRefreshing(true);
    await refetch();
    onRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <Container
        // contentContainerStyle={{
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }
      >
        {data?.seePhoto && <Photo {...data.seePhoto}/>}
      </Container>
    </ScreenLayout>
  );
}
export default PhotoScreen;