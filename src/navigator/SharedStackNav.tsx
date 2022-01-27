import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import Feed from "../screens/Feed";
import Likes from "../screens/Likes";
import Me from "../screens/Me";
import Notification from "../screens/Notification";
import Photo from "../screens/Photo";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Comments from "../screens/Comments";
// import logo from "../../assets/logo.png"

const Stack = createNativeStackNavigator();

interface ISharedStackNavProps {
  screenName: string;
}

const Img = styled.Image`
  height: 50px;
  width: 100%;
`;

const SharedStackNav: React.FC<ISharedStackNavProps> = ({screenName}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:{
          backgroundColor:"black",
        },
        headerTintColor:"white",
        headerShadowVisible:true,
        headerBackTitleVisible:false,
      }}
    >
      {screenName === "Feed"?<Stack.Screen name={"Feed"} component={Feed} options={{
        headerTitle:()=><Img source={require("../../assets/logo.png")} resizeMode="contain"/>
      }}/>:null}
      {screenName === "Search"?<Stack.Screen name={"Search"} component={Search} />:null}
      {screenName === "Notification"?<Stack.Screen name={"Notification"} component={Notification}/>:null}
      {screenName === "Me"?<Stack.Screen name={"Me"} component={Me}/>:null}
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="Photo" component={Photo}/>
      <Stack.Screen name="Likes" component={Likes}/>
      <Stack.Screen name="Comments" component={Comments}/>
    </Stack.Navigator>
  );
}
export default SharedStackNav;

// interface ISharedStackNavProps {
//   component: React.ComponentType<FunctionComponent>;
//   name: string;
// }

// const SharedStackNav: React.FC<ISharedStackNavProps> = ({name,component}) => {
//   return <Stack.Navigator>
//     <Stack.Screen name={name} component={component}/>
//     <Stack.Screen name="Profile" component={Profile}/>
//     <Stack.Screen name="Photo" component={Photo}/>
//   </Stack.Navigator>;
// }
// export default SharedStackNav;
