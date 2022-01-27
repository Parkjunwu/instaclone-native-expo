import React, { useEffect } from "react";
import { FlatList, View, ListRenderItem, TouchableOpacity } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { gql, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../fragment";
import ScreenLayout from "../components/ScreenLayout";
import { seeRooms, seeRooms_seeRooms } from "../__generated__/seeRooms";
import RoomItem from "../components/rooms/RoomItem";

const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

type NavParam = {
  Rooms:undefined;
  Room:undefined;
}

type Props = StackScreenProps<NavParam>

const Rooms = ({navigation}:Props) => {
  const {data,loading,refetch} = useQuery<seeRooms>(SEE_ROOMS);
  console.log(data);
  useEffect(()=>{
    navigation.setOptions({
      headerLeft:({tintColor}) => <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="chevron-down" color={tintColor} size={30} />
      </TouchableOpacity>
    })
  },[])
  // refetch();
  
  const renderRooms:ListRenderItem<seeRooms_seeRooms | null> = ({item:room}) => {
    if(room) {
      return <RoomItem room={room}/>
    }
    return null;
  }
  return <ScreenLayout loading={loading}>
    {data?.seeRooms && <FlatList
      style={{width:"100%"}}
      ItemSeparatorComponent={()=><View style={{height:1,width:"100%",backgroundColor:"rgba(255,255,255,0.5)"}}/>}
      data={data.seeRooms}
      keyExtractor={room => room?.id +""}
      renderItem={renderRooms}
    />}
  </ScreenLayout>
}
export default Rooms;