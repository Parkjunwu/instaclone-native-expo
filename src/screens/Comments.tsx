import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: black;
  flex:1;
  align-items: center;
  justify-content: center;
`;
const Text = styled.Text`
  color: white;
`;

const Comments = () => {
  return <Container>
    <Text>Comments</Text>
  </Container>;
}
export default Comments;