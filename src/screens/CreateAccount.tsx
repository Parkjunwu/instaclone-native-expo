import { gql, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../color";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { Input } from "../components/auth/AuthShared";
import { createAccount, createAccountVariables } from "../__generated__/createAccount";

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 10px;
`;

type RouteParams = {
  userName: string;
  password: string;
}

type RootStackParamList = {
  Welcome: undefined;
  LogIn: RouteParams | undefined;
  CreateAccount: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

type FormData = {
  firstName:string;
  lastName:string;
  userName:string;
  email:string;
  password:string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!,
    $lastName: String,
    $userName: String!,
    $email: String!,
    $password: String!
  ) { createAccount(
    firstName:$firstName,
    lastName:$lastName,
    userName:$userName,
    email:$email,
    password:$password
  ){
    ok
    id
    error
  }}
`;

const CreateAccount = ({navigation:{navigate}}:Props) => {
  const onCompleted = (data:createAccount) => {
    const {createAccount:{ok}} = data;
    if(ok){
      const {userName,password} = getValues();
      navigate("LogIn", {
        userName,
        password
      });
    }
  }
  const [createAccountMutation,{loading}] = useMutation<createAccount,createAccountVariables>(CREATE_ACCOUNT_MUTATION)
  const {register, handleSubmit, setValue, watch,getValues} = useForm<FormData>();
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onNext = (nextOne:React.RefObject<TextInput>) => {
    nextOne.current?.focus();
  }
  const goToLogIn = () => navigate("LogIn");
  const onValid: SubmitHandler<FormData> = (data) => {
    if(!loading){
      createAccountMutation({
        variables:{
          ...data
        },
        onCompleted,
      })
    }
  };
  useEffect(() => {
    register("firstName",{
      required:true,
    });
    register("lastName",{
      required:true,
    });
    register("userName",{
      required:true,
    });
    register("email",{
      required:true,
    });
    register("password",{
      required:true,
    });
  },[register])
  return <AuthLayout>
    <Input
      placeholder="First Name"
      returnKeyType="next"
      autoCapitalize="none"
      onSubmitEditing={()=>onNext(lastNameRef)}
      blurOnSubmit={false}
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      onChangeText={(text)=>setValue("firstName",text)}
    />
    <Input
      placeholder="Last Name"
      returnKeyType="next"
      autoCapitalize="none"
      ref={lastNameRef}
      onSubmitEditing={()=>onNext(userNameRef)}
       blurOnSubmit={false} 
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      onChangeText={(text)=>setValue("lastName",text)}
    />
    <Input
      placeholder="User Name"
      returnKeyType="next"
      autoCapitalize="none"
      ref={userNameRef}
      onSubmitEditing={()=>onNext(emailRef)}
      blurOnSubmit={false} 
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      onChangeText={(text)=>setValue("userName",text)}
    />
    <Input
      placeholder="Email"
      keyboardType="email-address"
      returnKeyType="next"
      autoCapitalize="none"
      ref={emailRef}
      onSubmitEditing={()=>onNext(passwordRef)}
      blurOnSubmit={false} 
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      onChangeText={(text)=>setValue("email",text)}
    />
    <Input
      placeholder="Password"
      secureTextEntry={true}
      // autoCapitalize="none"
      returnKeyType="done"
      ref={passwordRef}
      onSubmitEditing={handleSubmit(onValid)}
      placeholderTextColor={"rgba(255,255,255,0.8)"}
      lastOne={true}
      onChangeText={(text)=>setValue("password",text)}
    />
    <AuthButton text="Create Account" onPress={handleSubmit(onValid)} disabled={false} loading={true}/>
    <TouchableOpacity onPress={goToLogIn}>
      <LoginLink>Log In</LoginLink>
    </TouchableOpacity>
  </AuthLayout>;
};

export default CreateAccount;