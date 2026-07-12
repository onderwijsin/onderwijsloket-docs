<script setup lang="ts">
import { SCALAR_BASE_PATH } from "@config/constants";

import type { ContentNavigationItem, PageCollections } from "@nuxt/content";

const props = defineProps<{
  navigation?: ContentNavigationItem[];
}>();

const { publisher, scalar } = useAppConfig();
const { forced: forcedColorMode } = useDocusColorMode();
const { locale, isEnabled } = useDocusI18n();

const collectionName = computed(
  () => (isEnabled.value ? `docs_${locale.value}` : "docs") as keyof PageCollections
);

const {
  search,
  status: searchStatus,
  init
} = useSearchCollection(collectionName, {
  immediate: false,
  ignoredTags: ["style"]
});

const { open } = useContentSearch();
watch(open, (value) => {
  if (value && searchStatus.value === "idle") {
    init();
  }
});

type NavigationItem = {
  label: string;
  icon: string;
  to: string;
};

const links = computed<NavigationItem[]>(() => {
  const items: NavigationItem[] = [];

  if (props.navigation) {
    items.push(
      ...props.navigation
        .filter((item) => item.children?.length)
        .map((item) => ({
          label: item.title,
          icon: item.icon as string,
          to: item.children![0]!.path
        }))
    );
  }

  if (scalar.enabled) {
    items.push({
      label: "API Reference",
      icon: getIcon("api_explorer"),
      to: SCALAR_BASE_PATH
    });
  }

  if (publisher.contact) {
    items.push({
      label: "Get in touch",
      icon: getIcon("mail"),
      to: publisher.contact
    });
  }
  return items;
});
</script>

<template>
  <LazyUContentSearch
    :search="search"
    :search-status="searchStatus"
    :links="links"
    :navigation="navigation"
    :color-mode="!forcedColorMode"
  />
</template>
