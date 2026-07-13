<script lang="ts" setup>
const { isProd } = useRuntimeConfig().public.mode;

if (isProd) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
    fatal: import.meta.client
  });
}

const image = defineOgImage("Docs.takumi", {
  title: "Docs.takumi",
  description: "Documentation for Docs.takumi"
});
</script>

<template>
  <UContainer>
    <h1 class="font-bold">Hello</h1>
    <pre>{{ image }}</pre>
  </UContainer>
</template>
