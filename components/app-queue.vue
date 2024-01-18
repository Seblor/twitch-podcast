<template>
  <UCard class="flex flex-col flex-1"
    :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex justify-between">
        <span class="grow">Queue</span>
        <Icon class="text-2xl cursor-pointer hover:bg-gray-500 rounded" name="heroicons:x-mark-16-solid"
          :color="colorMode.value === 'light' ? 'dark' : 'light'" @click="queue.isOpen = !queue.isOpen" />
      </div>
    </template>
    <div class="flex flex-col grow gap-2">
      <TransitionGroup name="list">
        <div v-for="(item, index) in data" :key="index">
          <QueueCard :queue-item="item" />
        </div>
      </TransitionGroup>
    </div>
    <template #footer>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { QueueItem, UserDownload } from '~/utils/types'

const colorMode = useColorMode()
const queue = useQueue()
const user = useUser()

const { data, pending, refresh } = await useFetch<QueueItem[]>('/api/queue', {
  method: 'GET',
  query: {
    userId: user.value.userId,
  }
})

const refreshIntvl = setInterval(() => {
  refresh()
}, 1000)

onUnmounted(() => {
  clearInterval(refreshIntvl)
})

function isUserDownload(item: QueueItem): item is UserDownload {
  return item?.id !== null
}

</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>