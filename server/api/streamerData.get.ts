import { StreamerData, StreamerVideos, streamerQuery } from "~/utils/types";

// @ts-ignore
import TwitchGQL from 'twitch-gql';

const twitchClient = TwitchGQL.Init();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const streamerExists = (await twitchClient.GetUser(query.streamerId))

  if (streamerExists.data?.user == null) return createError({
    statusCode: 404,
    message: 'Streamer not found',
  })

  const [videos] = (await twitchClient.GetVideos(query.streamerId)) as StreamerVideos[]
  const [userData] = (await twitchClient._SendQuery('StreamMetadata', { channelLogin: query.streamerId }, true)) as StreamerData[]

  const formattedData = videos.data.user.videos ?? []

  // Removing the current broadcast as it will download as long as teh broadcast is live and will hog queue time
  // However, only the thumnail URL carries the last broadcast ID, so we need to filter it out
  formattedData.edges = formattedData.edges?.filter(edge => !edge.node.animatedPreviewURL.includes(userData.data.user.lastBroadcast.id))

  return {
    name: query.streamerId,
    streamer: userData,
    podcasts: formattedData
  } as streamerQuery
})
