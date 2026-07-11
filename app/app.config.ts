export default defineAppConfig({
  seo: {
    // Default to `%s - ${site.name}`
    titleTemplate: "",
    // Default to package.json name
    title: "",
    // Default to package.json description
    description: "",
  },
  search: {
    fts: true,
  },
  socials: {
    github: "https://github.com/onderwijsin",
  },
  github: {
    url: "https://github.com/onderwijsin/onderwijsloket-docs",
    branch: "main",
    rootDir: ".",
  },
  toc: {
    // Rename the title of the table of contents
    title: "On this page",
    // Add a bottom section to the table of contents
    bottom: {
      title: "Further Reading",
      links: [
        {
          icon: "lucide:github",
          label: "Code Examples",
          to: "https://github.com/onderwijsin/onderwijsloket-examples",
          target: "_blank",
        },
        {
          icon: "lucide:code",
          label: "View Source Code",
          to: "https://github.com/onderwijsin/onderwijsloket-docs",
          target: "_blank",
        },
      ],
    },
  },
  assistant: {
    // Show the floating input on documentation pages
    floatingInput: true,

    // Show the "Explain with AI" button in the sidebar
    explainWithAi: true,

    // FAQ questions to display when chat is empty
    faqQuestions: [],

    // Keyboard shortcuts
    shortcuts: {
      focusInput: "meta_i",
    },

    // Custom icons
    icons: {
      trigger: "i-lucide-sparkles",
      explain: "i-lucide-brain",
    },
  },
});
