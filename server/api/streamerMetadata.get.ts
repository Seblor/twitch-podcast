// @ts-ignore
import TwitchGQL from 'twitch-gql';
import lodash from 'lodash';
import { StreamerData, StreamerMetadata } from '~/utils/types';

const twitchClient = TwitchGQL.Init();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  await new Promise(resolve => setTimeout(resolve, 3000))

  const allStreamerData: StreamerData & StreamerMetadata = {
    ...await Promise.all<[StreamerData, StreamerMetadata[]]>([
      twitchClient.GetUser(query.streamerId),
      twitchClient._SendQuery('StreamMetadata', { channelLogin: query.streamerId }, true) // This is not processed by the lib, thus it returns an array
    ]).then(([streamerMetadata, userData]) => {
      return lodash.merge(streamerMetadata, userData[0])
    })
  }

  if (allStreamerData.data?.user == null) return createError({
    statusCode: 404,
    message: 'Streamer not found',
  })

  return allStreamerData
})
