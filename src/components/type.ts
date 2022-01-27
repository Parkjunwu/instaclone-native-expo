type baseProps = {
  Profile: {id:number,userName:string};
  Likes: {photoId:number};
  Comments: undefined;
}

export type FeedStackProps = baseProps & {
  Feed: undefined;
  Photo: undefined;
};

export type MeStackProps = baseProps & {
  Me: undefined;
  Photo: undefined;
};

export type SearchStackProps = baseProps & {
  Search: undefined;
  Photo: {photoId: number};
};