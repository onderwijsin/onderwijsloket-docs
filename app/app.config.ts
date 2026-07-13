import { siteTitle, siteDescription } from "@config/identity";
import { getIcon } from "~~/shared/utils/icons";

export default defineAppConfig({
  statusPage: "https://kuma.onderwijsin.nl/status/onderwijsloket",
  publisher: {
    name: "Stichting Onderwijs in",
    url: "https://onderwijsin.nl",
    contact: "https://onderwijsin.nl/contact"
  },

  scalar: {
    enabled: true
  },

  seo: {
    title: siteTitle,
    description: siteDescription
  },

  search: {
    fts: true
  },
  socials: {
    github: "https://github.com/onderwijsin"
  },
  // @ts-expect-error upstream type mismatch
  github: false,
  toc: {
    // Rename the title of the table of contents
    title: "On this page",
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
        },
        {
          icon: getIcon("mail"),
          label: "Newsletter",
          to: "https://onderwijsin.nl/nieuwsbrief",
          target: "_blank"
        }
      ]
    }
  },
  assistant: {
    // Show the floating input on documentation pages
    floatingInput: true,
    // Show the "Explain with AI" button in the sidebar
    explainWithAi: true,
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
    ],
    // Keyboard shortcuts
    shortcuts: {
      focusInput: "meta_i"
    }
  },

  ui: {
    colors: {
      primary: "pink",
      secondary: "purple",
      neutral: "zinc"
    },
    page: {
      slots: {
        root: "flex flex-col lg:grid lg:grid-cols-10 lg:gap-10",
        left: "lg:col-span-2",
        center: "lg:col-span-8",
        right: "lg:col-span-2 order-first lg:order-last"
      }
    },
    footer: {
      slots: {
        root: "relative"
      }
    }
  }
});
