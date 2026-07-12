import { defineNuxtPlugin } from "#app/nuxt";
import { computed, useColorMode, useHead, watch } from "#imports";

/**
 * Synchronizes the active color mode with the body class.
 *
 * @returns Nothing.
 */
export default defineNuxtPlugin((nuxtApp): void => {
  const colorMode = useColorMode();

  const bodyClass = computed<string>(() => `${colorMode.value}-mode`);

  /**
   * Removes stale mode classes and applies the current color mode.
   *
   * @returns Nothing.
   */
  const syncBodyClass = (): void => {
    if (!import.meta.client) {
      return;
    }

    const modeClasses = [...document.body.classList].filter((className) =>
      className.endsWith("-mode")
    );

    document.body.classList.remove(...modeClasses);
    document.body.classList.add(bodyClass.value);
  };

  useHead({
    bodyAttrs: {
      class: bodyClass
    }
  });

  watch(
    () => colorMode.value,
    () => {
      syncBodyClass();
    }
  );

  nuxtApp.hook("app:mounted", () => {
    syncBodyClass();
  });

  nuxtApp.hook("page:finish", () => {
    syncBodyClass();
  });
});
