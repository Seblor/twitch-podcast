import DownloadManager from "../DownloadManager"


export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.downloadId == undefined || typeof query.downloadId !== 'string') return createError({
    statusCode: 400,
    message: 'Download ID is invalid'
  })

  if (query.userId == undefined || typeof query.userId !== 'string') return createError({
    statusCode: 400,
    message: 'User Identifier is invalid'
  })

  const downloadFound = [...DownloadManager.pendingDownloads, ...Object.values(DownloadManager.currentDownloads)].some((download) => {
    return download.userIdentifier === query.userId && download.id === query.downloadId
  })

  if (!downloadFound) {
    return createError({
      statusCode: 404,
      message: 'Download not found'
    })
  }

  DownloadManager.cancelPodcastRequest(String(query.downloadId))
})
