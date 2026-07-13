<script lang="ts" setup>
const { isProd } = useRuntimeConfig().public.mode;

if (isProd) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
    fatal: import.meta.client
  });
}
</script>

<template>
  <UContainer>
    <h1 class="font-bold">Hello</h1>
  </UContainer>
</template>
