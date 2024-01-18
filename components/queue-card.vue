<template>
  <UCard v-if="isUserDownload(props.queueItem)"
    :ui="{ body: { base: 'dark:bg-gray-800 bg-gray-200', padding: 'p-1 sm:p-1' }, header: { padding: 'p-1 sm:p-1' }, footer: { padding: 'p-0 sm:p-0' } }">
    <template #header>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <span>{{ queue.downloads.find(download => download.id === props.queueItem.id)?.title }}</span>
          <span v-if="props.queueItem.eta">({{ props.queueItem.eta }})</span>
        </div>
        <div>
          <Icon class="text-2xl cursor-pointer hover:bg-gray-500 rounded" name="heroicons:trash"
            :color="colorMode.value === 'light' ? 'dark' : 'light'" @click="removeDownload(props.queueItem.id)" />
        </div>
      </div>
    </template>
    <span class="break-words">{{ queue.downloads.find(download => download.id === props.queueItem.id)?.description }}</span>
    <template v-if="props.queueItem.progress !== null" #footer>
      <UProgress v-if="props.queueItem.progress !== null" :ui="{
        progress: {
          rounded: 'rounded-t [&::-webkit-progress-bar]:rounded-t',
          bar: '[&::-webkit-progress-value]:rounded-t-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-t-full'
        }
      }" :value="props.queueItem.progress" />
    </template>
  </UCard>
  <UCard v-else
    :ui="{ body: { base: 'dark:bg-gray-800 bg-gray-200', padding: 'p-1 sm:p-1' }, header: { padding: 'p-1 sm:p-1' }, footer: { padding: 'p-0 sm:p-0' } }">
    <template #header>
      <span>{{ props.queueItem.waitingList }} download{{ props.queueItem.waitingList > 1 ? 's' : '' }}</span>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const queue = useQueue()
const user = useUser()

const props = defineProps<{ queueItem: QueueItem }>()

function isUserDownload(item: QueueItem): item is UserDownload {
  return item?.id !== null
}

function removeDownload(downloadId: string): Promise<unknown> {
  return useFetch<QueueItem[]>('/api/cancelDownload', {
    method: 'DELETE',
    query: {
      userId: user.value.userId,
      downloadId
    }
  })
}
</script>
