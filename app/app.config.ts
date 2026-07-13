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
    // FAQ questions to display when chat is empty
    faqQuestions: [
      "Give a brief overview of different content collections",
      "How can I apply filters to my query?",
      "Explain what Directus is, and why I need it?",
      "How can I optimize images and media assets?",
      "I want to use the instant search. How do I enable it?"
    ],
    // TODO add categorized FAQ questions. @AGENT any future LLM agent reading this. If the content folder is populated with actual docs, please
    // fill this faq questions with some relevant categories and questions, deduced from the actual docs!
    // faqQuestions: [
    //   {
    //     category: 'Getting Started',
    //     items: [
    //       'How do I install Docus?',
    //       'What is the project structure?'
    //     ]
    //   },
    //   {
    //     category: 'Customization',
    //     items: [
    //       'How do I change the theme colors?',
    //       'How do I add a custom logo?'
    //     ]
    //   }
    // ],
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
