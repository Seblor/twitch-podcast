import { QueueItem } from "~/utils/types"
import DownloadManager from "../DownloadManager"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.userId == undefined || typeof query.userId !== 'string') return createError({
    statusCode: 400,
    message: 'User Identifier is invalid'
  })

  const queue: QueueItem[] = [];

  Object.values(DownloadManager.currentDownloads).forEach(download => {
    if (download.userIdentifier === query.userId) {
      queue.push({
        id: download.id,
        progress: download.progress,
        eta: download.eta
      })
    } else {
      const previousItem = queue.at(-1)
      if (previousItem && previousItem.id === null) {
        previousItem.waitingList++
      } else {
        queue.push({
          id: null,
          waitingList: 1
        })
      }
    }
  })

  DownloadManager.pendingDownloads.forEach(download => {
    if (download.userIdentifier === query.userId) {
      queue.push({
        id: download.id,
        progress: Number.NaN,
        eta: ''
      })
    } else {
      const previousItem = queue.at(-1)
      if (previousItem && previousItem.id === null) {
        previousItem.waitingList++
      } else {
        queue.push({
          id: null,
          waitingList: 1
        })
      }
    }
  })

  return queue
})
