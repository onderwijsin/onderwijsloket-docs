<script setup lang="ts">
const app = useAppConfig();
</script>

<template>
  <template>
    <div class="text-sm text-muted">
      Copyright © {{ new Date().getFullYear() }} -
      <NuxtLink class="underline" :to="app.publisher.url">{{ app.publisher.name }}</NuxtLink>
    </div>
  </template>
</template>
