<script lang="ts" setup>
const route = useRoute();

const isExplorer = computed(() => route.path.startsWith("/api-reference"));
</script>

<template>
  <UButton
    :to="isExplorer ? '/getting-started/introduction' : '/api-reference'"
    color="primary"
    size="sm"
    variant="soft"
    class="hidden lg:inline-flex"
    :icon="isExplorer ? 'lucide:book-open' : 'lucide:code-xml'"
  >
    {{ isExplorer ? "Documentation" : "API Explorer" }}
  </UButton>
</template>
