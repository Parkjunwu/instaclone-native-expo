/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleLike
// ====================================================

export interface toggleLike_toggleLike {
  __typename: "ToggleLikeResult";
  ok: boolean;
  error: string | null;
}

export interface toggleLike {
  toggleLike: toggleLike_toggleLike | null;
}

export interface toggleLikeVariables {
  id: number;
}
