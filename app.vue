<template>
  <div class="h-[100vh] w-[full] flex flex-col">
    <AppHeader class="fixed h-12 w-full z-10" />
    <NuxtPage class="pt-14" />
    <UNotifications />
    <USlideover v-model="queue.isOpen">
      <AppQueue />
    </USlideover>
    <div
      class="cursor-pointer fixed top-1/2 dark:bg-gray-900 bg-gray-300 rounded-full h-16 w-16 translate-x-1/2 translate-y-1/2 right-0"
      @click="queue.isOpen = true">
      <Icon class="mt-6 ml-3" name="heroicons:bars-3-16-solid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const queue = useQueue()

useHead({
  bodyAttrs: {
    class: 'dark:bg-stone-700 dark:text-white'
  },
  htmlAttrs: {
    class: 'w-full h-[100vh]'
  }
})
</script>
