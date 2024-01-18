<template>
  <button class="flex items-baseline" @click="colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'">
    <Icon :name="colorMode.value === 'light' ? 'uil:sun' : 'uil:moon'"
      :color="colorMode.value === 'light' ? 'dark' : 'light'" />
  </button>
</template>

<script setup>
const colorMode = useColorMode()
</script>

<style>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}

.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}

.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>