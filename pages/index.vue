<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col items-center gap-6">
      <img class="w-[25vw] max-w-[192px]" src="/img/icon-192.png" alt="">
      <h1 class="text-3xl">Welcome to <span class="text-primary-500 dark:text-primary-400">Twitch Podcast</span></h1>
      <p class="text-center">Download any Twitch VOD as an audio file suitable for a podcast format</p>
    </div>
    <div class="flex flex-col mt-16 items-center grow">
      <UFormGroup class="flex flex-col items-center" label="Streamer name">
        <UInput placeholder="SovietWomble" icon="i-heroicons-user" v-model="streamerName">
          <template v-if="streamerData" #leading>
            <UAvatar :src="streamerData.data.user.profileImageURL" size="3xs" class="mx-0.5" />
          </template>
        </UInput>
      </UFormGroup>
      <UCard v-if="requestPending || streamerData" class="my-2">
        <div v-if="requestPending === false && streamerData" class="flex items-center space-x-4">
          <img class="h-12 w-12 rounded-full" :src="streamerData.data.user.profileImageURL" alt="" />
          <div class="flex flex-col">
            <p class="w-[250px]">{{ streamerData.data.user.displayName }}</p>
            <p class="w-[200px] italic">{{ streamerData.data.user.description }}</p>
          </div>
          <a class="w-0 -translate-x-[50px]" :href="`/streamer/${streamerData.data.user.login}`">
            <UButton :ui="{ rounded: 'rounded-full' }" icon="i-heroicons-pencil-square" size="xl" />
          </a>
        </div>
        <div v-else class="flex items-center space-x-4">
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash'
import type { StreamerData, StreamerMetadata } from '~/utils/types';

const streamerName = ref('')
const streamerData = ref<StreamerData & StreamerMetadata | null>(null)
const requestPending = ref(false)
let currentRequestAbortController = new AbortController()

const requestStreamerData = debounce(async () => {
  if (streamerName.value) {
    requestPending.value = true
    const { data, error } = await useLazyFetch<StreamerData & StreamerMetadata>('/api/streamerMetadata', {
      method: 'GET',
      signal: currentRequestAbortController.signal,
      query: {
        streamerId: streamerName.value
      }
    })
    requestPending.value = false
    if (error.value || data.value === null) {
      streamerData.value = null
    } else {
      streamerData.value = data.value
    }
  }

  return null
}, 500)

watch(streamerName, () => {
  streamerData.value = null
  currentRequestAbortController.abort()
  currentRequestAbortController = new AbortController()
  requestStreamerData()
})

</script>
