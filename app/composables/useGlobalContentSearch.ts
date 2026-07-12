import { computed, shallowRef, watch, type MaybeRefOrGetter, toValue } from "vue";

import type { ContentNavigationItem, PageCollections } from "@nuxt/content";

import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";

type ContentSearchResult = {
  id: string;
  title: string;
  titles: string[];
  content: string;
  level: number;
  snippets?: {
    title?: string;
    content?: string;
  };
};

type ApiContentRecord = {
  path: string;
  title: string;
  description: string;
  kind: "info" | "tag" | "operation" | "schema";
  scalarTarget: string;
  method?: string;
  operationId?: string;
};

export interface GlobalSearchItem extends CommandPaletteItem {
  id?: string;
  method?: string;
  path?: string;
}

/**
 * Run documentation and generated API searches through separate FTS5 indexes.
 *
 * Keeping indexes separate lets documentation retain a fixed visual and result
 * precedence while API results expose the metadata needed by the command palette.
 */
export function useGlobalContentSearch({
  collection,
  navigation,
  links,
  themeItems
}: {
  collection: MaybeRefOrGetter<keyof PageCollections>;
  navigation: MaybeRefOrGetter<ContentNavigationItem[] | undefined>;
  links: MaybeRefOrGetter<GlobalSearchItem[]>;
  themeItems: MaybeRefOrGetter<GlobalSearchItem[]>;
}) {
  const searchTerm = shallowRef("");
  const documents = useSearchCollection(collection, {
    immediate: false,
    ignoredTags: ["style"]
  });
  const api = useSearchCollection("api", {
    immediate: false,
    ignoredTags: ["style"]
  });
  const { mapSearchResults } = useContentSearch();
  const documentResults = shallowRef<ContentSearchResult[]>([]);
  const apiResults = shallowRef<ContentSearchResult[]>([]);
  const apiRecords = shallowRef(new Map<string, ApiContentRecord>());
  const isMetadataReady = shallowRef(false);
  const isSearching = computed(
    () => documents.status.value === "loading" || api.status.value === "loading"
  );
  let requestId = 0;
  let searchTimeout: ReturnType<typeof setTimeout> | undefined;

  async function loadApiRecords() {
    if (isMetadataReady.value) {
      return;
    }

    const records = await queryCollection("api")
      .select("path", "title", "description", "kind", "scalarTarget", "method", "operationId")
      .all();
    apiRecords.value = new Map(
      records.flatMap((record) =>
        typeof record.path === "string" ? [[record.path, record as ApiContentRecord] as const] : []
      )
    );
    isMetadataReady.value = true;
  }

  async function initialize() {
    await Promise.all([documents.init(), api.init(), loadApiRecords()]);
  }

  async function runSearch(term: string) {
    const currentRequest = ++requestId;
    const query = term.trim();
    if (!query) {
      documentResults.value = [];
      apiResults.value = [];
      return;
    }

    const [docs, apiSearch] = await Promise.all([
      documents.search(query, {
        limit: 12,
        snippet: { columns: ["title", "content"], around: 20 }
      }),
      api.search(query, {
        limit: 8,
        snippet: { columns: ["title", "content"], around: 20 }
      })
    ]);

    if (currentRequest !== requestId) {
      return;
    }

    documentResults.value = docs as ContentSearchResult[];
    apiResults.value = apiSearch as ContentSearchResult[];
  }

  watch(searchTerm, (term) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      void runSearch(term);
    }, 100);
  });

  const groups = computed<CommandPaletteGroup[]>(() => {
    const result: CommandPaletteGroup[] = [];
    const term = searchTerm.value.trim();

    if (!term) {
      const linkItems = toValue(links);
      if (linkItems.length) {
        result.push({
          id: "links",
          label: "Links",
          items: linkItems,
          ignoreFilter: true
        });
      }
      const theme = toValue(themeItems);
      if (theme.length) {
        result.push({
          id: "theme",
          label: "Theme",
          items: theme,
          ignoreFilter: true
        });
      }
      return result;
    }

    const documentItems = mapSearchResults(documentResults.value, toValue(navigation)).flatMap(
      (item) =>
        typeof item.to === "string" && item.label
          ? [
              {
                id: item.to,
                label: item.label,
                description: item.description,
                prefix: item.prefix,
                suffix: item.suffix,
                icon: item.icon,
                to: item.to
              }
            ]
          : []
    );
    if (documentItems.length) {
      result.push({
        id: "documentation",
        label: "Documentation",
        items: documentItems,
        ignoreFilter: true
      });
    }

    const operationItems: GlobalSearchItem[] = [];
    const metadataItems: GlobalSearchItem[] = [];
    for (const resultItem of apiResults.value) {
      const record = apiRecords.value.get(resultItem.id);
      if (!record) {
        continue;
      }

      const item: GlobalSearchItem = {
        id: resultItem.id,
        label: record.kind === "operation" ? (record.path ?? record.title) : record.title,
        description: record.description || resultItem.content,
        prefix: record.kind === "schema" ? "Model" : record.kind === "tag" ? "Tag" : "API",
        icon:
          record.kind === "schema"
            ? getIcon("braces")
            : record.kind === "tag"
              ? getIcon("tag")
              : getIcon("api_explorer"),
        method: record.method,
        path: record.kind === "operation" ? record.path : undefined,
        slot: record.kind === "operation" ? "api-operation" : undefined,
        to: record.scalarTarget
      };

      if (record.kind === "operation") {
        operationItems.push(item);
      } else {
        metadataItems.push(item);
      }
    }

    if (operationItems.length) {
      result.push({
        id: "api-operations",
        label: "API operations",
        items: operationItems,
        ignoreFilter: true
      });
    }
    if (metadataItems.length) {
      result.push({
        id: "api-metadata",
        label: "API models & metadata",
        items: metadataItems,
        ignoreFilter: true
      });
    }

    const theme = toValue(themeItems);
    if (theme.length) {
      result.push({
        id: "theme",
        label: "Theme",
        items: theme,
        ignoreFilter: true
      });
    }

    return result;
  });

  return {
    groups,
    initialize,
    isSearching,
    searchTerm
  };
}
