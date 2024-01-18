<template>
  <div v-if="pending">
    loading...
  </div>
  <div v-else>
    <div v-if="error?.statusCode === 404">
      <h1 class="text-4xl">Could not find streamer {{ $route.params.streamerId }}</h1>
    </div>
    <div v-else-if="data" class="text-center">
      <UCard :ui="{ base: 'mx-2', background: '' }">
        <div class="flex h-full">
          <div class="flex shrink-0">
            <a class="contents" :href="`https://twitch.tv/${data.name}`" target="_blank"><img class="rounded-full mr-4" :src="data.streamer.data.user.profileImageURL" alt=""></a>
            <UDivider orientation="vertical" />
          </div>
          <div class="flex flex-col items-center justify-center grow">
            <h1 class="text-4xl text-primary-500 dark:text-primary-400">{{ data.name }}</h1>
            <UFormGroup class="mx-3 w-1/2 max-w-64" name="filter">
              <UInput v-model="search" placeholder="Filter" type="filter" />
            </UFormGroup>
          </div>
        </div>
      </UCard>
      <div class="flex flex-wrap justify-center gap-4 m-8">
        <TransitionGroup name="list">
          <PodcastThumbnail v-for="podcast in filteredStreams" :key="podcast.node.id" :streamerName="data.name" :streamer="data.streamer" :podcast="podcast.node"
            class="w-64 min-h-32" />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data, pending, error } = await useLazyFetch<streamerQuery>('/api/streamerData', {
  method: 'GET',
  query: {
    streamerId: route.params.streamerId
  }
})

let search = ref('')

const filteredStreams = computed(() => {
  if (!data) return []
  return data.value?.podcasts.edges?.filter((podcast) => {
    return podcast.node.title.toLowerCase().includes(search.value.toLowerCase()) || podcast.node.game.displayName.toLowerCase().includes(search.value.toLowerCase())
  })
})

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