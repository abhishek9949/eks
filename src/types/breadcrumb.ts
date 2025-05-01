export interface BreadcrumbLevel {
  name: string | undefined;
  path?: string; // Optional path for navigation
  icon?: JSX.Element; // Optional icon
}

export interface BreadcrumbProps {
  levels?: BreadcrumbLevel[]; // Levels are optional, with a fallback
}
