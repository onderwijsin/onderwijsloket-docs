<script lang="ts" setup>
const route = useRoute();

const isExplorer = computed(() => route.path.startsWith("/explorer"));
</script>

<template>
  <UButton
    :to="isExplorer ? '/getting-started/introduction' : '/explorer'"
    color="neutral"
    size="sm"
    class="hidden lg:inline-flex"
  >
    {{ isExplorer ? "API Docs" : "API Explorer" }}
  </UButton>
</template>
