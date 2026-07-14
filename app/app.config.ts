import { APP_IDENTITY } from "~~/constants";
import { getIcon } from "#layers/docus-plus/shared/utils/icons";

export default defineAppConfig({
  statusPage: "https://kuma.onderwijsin.nl/status/onderwijsloket",

  seo: {
    title: APP_IDENTITY.siteTitle,
    description: APP_IDENTITY.siteDescription
  },
  toc: {
    // Add a bottom section to the table of contents
    bottom: {
      title: "Further Reading",
      links: [
        {
          icon: getIcon("github_alt"),
          label: "Code Examples",
          to: "https://github.com/onderwijsin/onderwijsloket-examples",
          target: "_blank"
        },
        {
          icon: getIcon("code"),
          label: "View Source",
          to: "https://github.com/onderwijsin/onderwijsloket-docs",
          target: "_blank"
        }
      ]
    }
  },
  assistant: {
    // Categorized conversation starters to display when chat is empty
    faqQuestions: [
      {
        category: "Getting started",
        items: [
          "Which API should power my first prototype?",
          "How do I request a token for server calls?",
          "What can I build with Onderwijsloket data?"
        ]
      },
      {
        category: "Directus API",
        items: [
          "How do I fetch articles with related FAQs?",
          "How do I filter results by topic or slug?",
          "How do I keep API responses small and fast?"
        ]
      },
      {
        category: "Search",
        items: [
          "How do I add Algolia search to my site?",
          "How do I search programmes near a location?",
          "How do I add facets to article search?"
        ]
      },
      {
        category: "Build and integrate",
        items: [
          "How do I render rich content documents?",
          "How do I turn asset IDs into image URLs?",
          "How do I embed an advice booking flow?"
        ]
      }
    ]
  },

  ui: {
    colors: {
      primary: "pink",
      secondary: "purple",
      neutral: "zinc"
    }
  }
});
