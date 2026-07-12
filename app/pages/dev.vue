<script lang="ts" setup>
const { data } = await useAsyncData("api", () => queryCollection("api").all());
</script>

<template>
  <UContainer>
    <h1 class="font-bold">Hello</h1>
    <pre>{{ data }}</pre>
  </UContainer>
</template>
