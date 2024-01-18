import type { YTDlpReadable } from "yt-dlp-wrap";

/**
 * API return types
 */

/**
 * 
 */
export type streamerQuery = {
  name: string;
  podcasts: Videos;
  streamer: StreamerData;
}

export type PodcastData = {
  id: string;
  title: string;
  games: string[];
  thumbnail: string;
}

export type UserDownload = {
  id: string;
  progress: number;
  eta: string;
}

export type WaitingList = {
  id: null;
  waitingList: number;
}

export type QueueItem = UserDownload | WaitingList

/**
 * TWITCH GRAPHQL RETURN VALUES
 */

/**
 * 
 */
export interface StreamerMetadata {
  data: Data;
  extensions: Extensions;
}
export interface Data {
  user: UserMetadata;
}
export interface UserMetadata {
  id: string;
  login: string;
  displayName: string;
  description: string;
  createdAt: string;
  roles: Roles;
  stream?: Stream;
}
export interface Roles {
  isPartner: boolean;
}


export interface StreamerData {
  data: {
    user: User;
  };
  extensions: Extensions;
}
export interface User {
  id: string;
  primaryColorHex?: string | null;
  isPartner: boolean;
  profileImageURL: string;
  primaryTeam: PrimaryTeam;
  squadStream?: any;
  channel: Channel;
  lastBroadcast: LastBroadcast;
  stream: Stream;
  __typename: string;
}
export interface PrimaryTeam {
  id: string;
  name: string;
  displayName: string;
  __typename: string;
}
export interface Channel {
  id: string;
  chanlets?: null;
  __typename: string;
}
export interface LastBroadcast {
  id: string;
  title: string;
  __typename: string;
}
export interface Stream {
  id: string;
  type: string;
  createdAt: string;
  __typename: string;
}
export interface Extensions {
  durationMilliseconds: number;
  operationName: string;
  requestID: string;
}


export interface StreamerVideos {
  data: {
    user: {
      id: string;
      videos: Videos;
      __typename: string;
    };
  };
  extensions: Extensions;
}
export interface Videos {
  edges?: (Video)[] | null;
  pageInfo: PageInfo;
  __typename: string;
}
export interface Video {
  cursor?: null;
  node: VideoData;
  __typename: string;
}
export interface VideoData {
  animatedPreviewURL: string;
  game: Game;
  id: string;
  lengthSeconds: number;
  owner: Owner;
  previewThumbnailURL: string;
  publishedAt: string;
  self: Self;
  title: string;
  viewCount: number;
  resourceRestriction?: null;
  contentTags?: (null)[] | null;
  __typename: string;
}
export interface Game {
  boxArtURL: string;
  id: string;
  displayName: string;
  name: string;
  __typename: string;
}
export interface Owner {
  displayName: string;
  id: string;
  login: string;
  profileImageURL: string;
  primaryColorHex?: null;
  __typename: string;
}
export interface Self {
  isRestricted: boolean;
  viewingHistory?: null;
  __typename: string;
}
export interface PageInfo {
  hasNextPage: boolean;
  __typename: string;
}

/**
 * DOWNLOADS
 */

/**
 * 
 */
export type PendingDownload = {
  id: string,
  videoId: string,
  userIdentifier: string,
  resolver: (value: YTDlpReadable) => void,
}

export type CurrentDownload = {
  id: string,
  videoId: string,
  userIdentifier: string,
  stream: YTDlpReadable,
  abortController: AbortController;
  progress: number,
  eta: string,
}
