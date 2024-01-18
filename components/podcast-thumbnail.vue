<template>
  <UCard @click="isOpen = true"
    :ui="{ header: { base: 'grow h-full flex flex-col items-center' }, body: { base: 'flex', padding: 'p-0 sm:p-0' }, footer: { base: 'shrink grow-0 flex items-center justify-between pl-0 pt-0 pb-0 sm:pl-0' } }"
    class="flex flex-col cursor-pointer hover:translate-x-1 transition-all hover:-translate-y-1 hover:shadow-purple-500 hover:drop-shadow-[0_35px_20px_rgba(0,0,0,0.25)]">
    <template #header>
      <span class="grow">{{ podcast.title }}</span>
      <span class="text-gray-500 h-2">{{ new Date(podcast.publishedAt).toLocaleString() }}</span>
    </template>
    <img class="grow" :src="podcast.previewThumbnailURL" alt="">
    <KeepAlive>
      <UModal v-model="isOpen">
        <PodcastModal :streamerName="streamerName" :streamer="props.streamer" :podcast="podcast" />
      </UModal>
    </KeepAlive>
    <template #footer>
      <img :src="podcast.game?.boxArtURL" alt="">
      <div class="flex flex-col grow content-center">
        <span class="text-sm">{{ podcast.game?.displayName ?? 'Unknown game' }}</span>
        <span class="text-gray-500">{{ secondsToHumanReadable(podcast.lengthSeconds) }}</span>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { secondsToHumanReadable } from '~/utils/timeFunctions';
import type { StreamerData } from '~/utils/types';

const props = defineProps<{ streamerName: string, streamer: StreamerData, podcast: VideoData }>()

const podcast = ref(props.podcast)
const isOpen = ref(false)
</script>
