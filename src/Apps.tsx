// import AppLoading from 'expo-app-loading';
// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Image, StyleSheet, Text, View } from 'react-native';
// import * as Font from 'expo-font';
// import {Ionicons} from "@expo/vector-icons"
// import { Asset } from 'expo-asset';
// import { NavigationContainer } from '@react-navigation/native';
// import LoggedOutNav from './navigator/LoggedOutNav';
// import Welcome from './screens/Welcome';

// export default function App() {
//   const [loading,setLoading] = useState(true);
//   const [login,setLogIn] = useState(true);
//   const onFinish = () => setLoading(false)
//   const preLoad = async() => {
//     const fontsToLoad: {[x: string]: any;}[] = [Ionicons.font];
//     const fontPromise = fontsToLoad.map((font) => Font.loadAsync(font));
//     const ImageToLoad = [
//       require("../assets/logo.png"),
//       "https://image.edaily.co.kr/images/photo/files/NP/S/2019/02/PS19021600119.jpg"]
//     const imagePromise = ImageToLoad.map(image=>{
//       if (typeof image === "string"){
//         return Image.prefetch(image)
//       } else {
//         return Asset.loadAsync(image)
//       }
//     })

//     await Promise.all([...fontPromise,...imagePromise])
//   }

//   if(loading) {
//     return (
//       <AppLoading
//         startAsync={preLoad}
//         onError={console.warn}
//         onFinish={onFinish}
//       />
//     )}
  
//   return (
//     <NavigationContainer>
//       <LoggedOutNav/>
//     </NavigationContainer>
//   );
// }

import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutNav from "./navigator/LoggedOutNav";
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import LoggedInNav from "./navigator/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, CachePersistor, persistCache } from "apollo3-cache-persist";
import 'react-native-gesture-handler';

export default function Apps() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const subscription = useColorScheme()
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const preloadAssets = async() => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [
      require("../assets/logo.png"),
    ];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    await Promise.all([...fontPromises, ...imagePromises]);
  };
  const preload = async() => {
    const token = await AsyncStorage.getItem("token")
    if(token) {
      isLoggedInVar(true);
      tokenVar(token);
    };
    await preloadAssets();
    await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
      /////
      // serialize:undefined,
    });
    const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    await persistor.restore();
  };
  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
     );
   }
  console.log(subscription)
  return (
    <ApolloProvider client={client}>
      <AppearanceProvider>
        <NavigationContainer>
          {isLoggedIn?<LoggedInNav/>:<LoggedOutNav/>}
        </NavigationContainer>
      </AppearanceProvider>
    </ApolloProvider>
  )
}
