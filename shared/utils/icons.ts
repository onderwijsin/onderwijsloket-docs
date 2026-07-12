const ICONS = {
  api_explorer: "lucide:code-xml",
  braces: "lucide:braces",
  github: "i-simple-icons-github",
  github_alt: "lucide:github",
  code: "lucide:code",
  mail: "lucide:send",
  tag: "lucide:tag",
  docs: "lucide:book-open"
};

export type IconKey = keyof typeof ICONS;

export function getIcon(key: IconKey) {
  return ICONS[key];
}
