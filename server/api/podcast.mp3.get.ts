import DownloadManager from "../DownloadManager"


export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.downloadId == undefined || typeof query.downloadId !== 'string') return createError({
    statusCode: 400,
    message: 'Download ID is invalid'
  })

  if (query.videoId == undefined || typeof query.videoId !== 'string') return createError({
    statusCode: 400,
    message: 'Video ID is invalid'
  })

  if (query.userId == undefined || typeof query.userId !== 'string') return createError({
    statusCode: 400,
    message: 'User Identifier is invalid'
  })

  const userDownloadCount = [...DownloadManager.pendingDownloads, ...Object.values(DownloadManager.currentDownloads)].reduce((acc, download) => {
    if (download.userIdentifier === query.userId) {
      acc++
    }
    return acc
  }, 0)

  if (userDownloadCount >= 2) {
    return createError({
      statusCode: 429,
      message: 'User has too many downloads'
    })
  }

  event.node.req.on('error', () => {
    DownloadManager.cancelUserRequests(String(query.userId))
  })

  let isRequestDone = false

  event.node.req.on('close', () => {
    if (isRequestDone) return
    DownloadManager.cancelUserRequests(String(query.userId))
  })

  const readableStream = await DownloadManager.queueNewDownload(query.videoId, query.userId, query.downloadId)

  isRequestDone = true

  return readableStream ? sendStream(event, readableStream) : createError({
    statusCode: 500,
    message: 'no readable stream'
  })

})
