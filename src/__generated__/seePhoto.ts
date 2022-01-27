/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePhoto
// ====================================================

export interface seePhoto_seePhoto_user {
  __typename: "User";
  id: number;
  userName: string;
  avatar: string | null;
}

export interface seePhoto_seePhoto_hashTags {
  __typename: "HashTag";
  id: number;
  hashTag: string;
}

export interface seePhoto_seePhoto {
  __typename: "Photo";
  id: number;
  user: seePhoto_seePhoto_user;
  hashTags: (seePhoto_seePhoto_hashTags | null)[] | null;
  file: string;
  caption: string | null;
  createdAt: string;
  likes: number;
  commentNumber: number;
  isMine: boolean;
  isLiked: boolean;
}

export interface seePhoto {
  seePhoto: seePhoto_seePhoto | null;
}

export interface seePhotoVariables {
  id: number;
}
