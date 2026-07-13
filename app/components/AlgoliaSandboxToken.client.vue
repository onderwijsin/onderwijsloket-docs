<script lang="ts" setup>
const { data } = await useAsyncData<{
  data: { sandbox_algolia_token: string };
}>("algolia_token", async () => {
  return $fetch("/api/directus/settings", {
    query: {
      fields: ["sandbox_algolia_token"]
    }
  });
});
</script>

<template>
  <ProsePre>{{ data?.data?.sandbox_algolia_token }}</ProsePre>
</template>
