<template>
  <UCard>
    <template #header>
      {{ podcast.title }}
    </template>
    <div class="preview-wrapper">
      <img class="w-full preview" :src="podcast.animatedPreviewURL" alt="">
    </div>
    <template #footer>
      <div class="flex justify-between">
        <UButton @click="downloadFile">Download podcast</UButton>
        <UButton><a :href="`https://www.twitch.tv/videos/${props.podcast.id}`" target="_blank">Watch on Twitch
            <Icon name="heroicons:arrow-top-right-on-square-16-solid" />
          </a></UButton>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { StreamerData } from '~/utils/types';

const toast = useToast()
const props = defineProps<{ streamerName: string, streamer: StreamerData, podcast: VideoData }>()
const queue = useQueue()
const user = useUser()

async function downloadFile() {
  const downloadId = user.value.userId + Date.now() + Math.random().toString(36).substring(2, 9)

  queue.value.downloads.push({
    id: downloadId,
    title: 'Downloading',
    date: Date.now(),
    description: `${props.streamerName} - ${props.podcast.title}`,
    progress: 0,
    eta: 'Calculating...',
  })
  toast.add({
    title: 'Download started',
    description: 'Your download request has been sent',
    actions: [
      {
        label: 'Open queue',
        click: () => queue.value.isOpen = true
      }
    ],
    timeout: 5000,
  })

  const { data, error } = await useFetch<Blob>('/api/podcast.mp3', {
    method: 'GET',
    responseType: 'blob',
    timeout: 3600e3, // 1 hour
    keepalive: true,
    query: {
      videoId: props.podcast.id,
      userId: user.value.userId,
      downloadId
    }
  })

  if (error.value?.statusCode === 429) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-x-circle',
      title: 'Error',
      description: 'You cannot have more than two downloads in the queue at the same time',
      timeout: 5000,
    })
    return
  }

  if (error.value !== null || data.value == null) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-x-circle',
      title: 'Error',
      description: 'An error occured while downloading the podcast',
      timeout: 5000,
    })
    return
  }

  const blobUrl = URL.createObjectURL(new Blob([data.value], { type: 'audio/mp3' }));
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = `${props.podcast.title}.mp3`; // set the desired filename 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

</script>

<style>
.preview-wrapper {
  aspect-ratio: 290/163;
  overflow: hidden;
}

.preview:hover {
  animation: preview-card-thumbnail__movement 6s steps(10) infinite;
}

@keyframes preview-card-thumbnail__movement {
  to {
    transform: translateY(-100%)
  }
}
</style>
