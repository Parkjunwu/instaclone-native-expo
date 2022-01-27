import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";
import { me } from "../__generated__/me";

const ME_QUERY = gql`
    query me {
      me {
        id
        userName
        avatar
      }
    }
`;

const useMe:()=>{data:me|undefined} = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const {data,refetch} = useQuery<me>(ME_QUERY,{
    skip: !hasToken
  });
  useEffect(()=>{
    if(data?.me === null) {
      logUserOut();
    }
  },[data])
  // refetch();
  return {data};
}
export default useMe;