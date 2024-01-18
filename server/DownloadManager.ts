import YTDlpWrap, { YTDlpReadable } from 'yt-dlp-wrap';
import fs from 'fs';
import { CurrentDownload, PendingDownload } from '~/utils/types';
import os from 'os'

process.on('unhandledRejection', function (err, promise) {
});

let setReady: Function | null = null;

const isReady = new Promise(resolve => setReady = resolve);

// @ts-ignore
const YTDLP = YTDlpWrap.default as typeof YTDlpWrap;

let ytDlpWrap: YTDlpWrap | null = null;

const binPath = './bin/yt-dlp' + (os.platform() === 'win32' ? '.exe' : '')

if (!fs.existsSync(binPath)) {
  YTDLP.downloadFromGithub(
    binPath,
    '2023.12.30',
    os.platform()
  ).then(() => {
    ytDlpWrap = new YTDLP(binPath);
    console.log('downloaded')
    setReady!();
  });
} else {
  ytDlpWrap = new YTDLP(binPath);
  setReady!();
}

class DownloadManager {
  pendingDownloads: PendingDownload[] = []

  currentDownloads: Record<string, CurrentDownload> = {}

  maxConcurrentDownloads = parseInt(process.env.CONCURRENT_DOWNLOADS ?? '1')

  async queueNewDownload(videoId: string, userIdentifier: string, downloadId: string): Promise<YTDlpReadable> {
    await isReady;
    const id = downloadId
    return new Promise(resolve => {
      this.pendingDownloads.push({ id, videoId, userIdentifier, resolver: resolve })
      this.processQueue()
    })
  }

  private processQueue() {
    if (Object.keys(this.currentDownloads).length >= this.maxConcurrentDownloads) return
    const nextDownload = this.pendingDownloads.shift()
    if (!nextDownload) return
    nextDownload.resolver(this.startDownload(nextDownload))
  }

  cancelPodcastRequest(downloadId: string) {
    const downloadIndex = this.pendingDownloads.findIndex(download => download.id === downloadId)
    if (downloadIndex !== -1) {
      this.pendingDownloads.splice(downloadIndex, 1)
      return
    }
    const download = this.currentDownloads[downloadId]
    if (download) {
      this.currentDownloads[download.id].abortController.abort()
      download.stream.destroy()
      delete this.currentDownloads[download.id]
    }
  }

  cancelUserRequests(userIdentifier: string) {
    this.pendingDownloads = this.pendingDownloads.filter(download => download.userIdentifier !== userIdentifier)
    Object.values(this.currentDownloads).forEach(download => {
      if (download.userIdentifier === userIdentifier) {
        this.currentDownloads[download.id].abortController.abort()
        download.stream.destroy()
        delete this.currentDownloads[download.id]
      }
    })
  }

  private startDownload(downloadData: {
    id: string,
    videoId: string,
    userIdentifier: string,
  }): YTDlpReadable {
    const { id, videoId, userIdentifier } = downloadData

    const abortController = new AbortController();

    let readableStream = ytDlpWrap!
      .execStream([
        // 'https://www.twitch.tv/videos/2035157660',
        `https://www.twitch.tv/videos/${videoId}`,
        '-f',
        'Audio_Only',
        '-o',
        '%(upload_date)s - %(id)s - %(title)s.mp3'
      ],
        undefined,
        abortController.signal
      )
      .on('progress', (progress) => {

        if (this.currentDownloads[id]) {
          this.currentDownloads[id].progress = progress.percent ?? Number.NaN / 100
        }
      })
      .on('ytDlpEvent', (eventType, eventData) => {
        if (eventType === 'download' && this.currentDownloads[id]) {
          this.currentDownloads[id].eta = /ETA (?:\d+:)?(\d+:\d+)/g.exec(eventData)?.[1] ?? ''
        }
      })
      .on('close', () => {
        delete this.currentDownloads[id]
        this.processQueue()
      });

    this.currentDownloads[id] = { id, stream: readableStream, abortController, videoId, userIdentifier, progress: 0, eta: '' }

    return readableStream
  }
}

export default new DownloadManager()