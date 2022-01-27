import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { MeStackProps } from "../components/type";
import useMe from "../hooks/useMe";

const Container = styled.View`
  background-color: black;
  flex:1;
  align-items: center;
  justify-content: center;
`;
const Text = styled.Text`
  color: white;
`;

type Prop = NativeStackScreenProps<MeStackProps,"Me">

const Me = ({navigation,route}:Prop) => {
  const {data} = useMe();
  useEffect(()=>{
    if(data?.me?.userName){
      navigation.setOptions({
        title:data.me.userName
      })
    }
  },[])
  console.log(data?.me?.userName);
  return <Container>
    <Text>Me</Text>
  </Container>;
}
export default Me;