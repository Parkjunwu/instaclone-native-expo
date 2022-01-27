import { gql, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, RefreshControl, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { HomeStackProps } from "../components/type";
import UserRow from "../components/UserRow";
import { seePhotoLikes, seePhotoLikesVariables, seePhotoLikes_seePhotoLikes } from "../__generated__/seePhotoLikes";

type Props = NativeStackScreenProps<HomeStackProps, 'Likes'>;

const SEE_PHOTO_LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!){
    seePhotoLikes(id: $id) {
      id
      userName
      avatar
      isFollowing
      isMe  
    }
  }
`;

const NoDataView = styled.View`
  margin-top:100px;
  align-items: center;
  /* background-color:blue; */
`;
const NoDataText = styled.Text`
  color: white;
  font-size: 19px;
  font-weight:700;
`;

const Likes = ({route}:Props) => {
  console.log(route?.params?.photoId);
  const [refreshing,setRefreshing] = useState(false);
  const {data,error,loading,refetch} = useQuery<seePhotoLikes,seePhotoLikesVariables>(SEE_PHOTO_LIKES_QUERY,{
    variables: {
      id:route?.params?.photoId,
    },
    skip:!route?.params?.photoId,
  })
  // useEffect(()=>{
  //   refetch();
  // },[])
  console.log(data?.seePhotoLikes);
  console.log(error);
  const renderUser:ListRenderItem<seePhotoLikes_seePhotoLikes |null> = ({item:user}) => {
    if(user) return <UserRow {...user}/>;
    return null;
  }
  const onRefresh = async() => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  const refreshControl = <RefreshControl
    refreshing={refreshing}
    onRefresh={onRefresh} />
  const NoDataComponent = <NoDataView><NoDataText>Pull down to refresh data</NoDataText></NoDataView>
  return (
    <ScreenLayout loading={loading}>
      {/* {data?.seePhotoLikes?.length !== 0 ? */}
       <FlatList
        data={data?.seePhotoLikes}
        renderItem={renderUser}
        keyExtractor={(user)=>user?.id + ""}
        refreshControl={refreshControl}
        ListEmptyComponent={NoDataComponent}
        ItemSeparatorComponent={()=><View style={{width:"100%",height:2,backgroundColor:"rgba(255,255,255,0.2)"}} />}
      />
      {/* :
      <FlatList
        data={["Pull down to refresh data"]}
        renderItem={({item})=><NoDataView><NoDataText>{item}</NoDataText></NoDataView>}
        keyExtractor={(_,index)=>index + ""}
        refreshControl={refreshControl}
      />
      } */}
    </ScreenLayout>
  );
}
export default Likes;