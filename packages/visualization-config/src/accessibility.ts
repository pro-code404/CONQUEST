/** Accessibility requirements for chart components — React/SVG only. */
export interface ChartA11yProps {
  title: string;
  description?: string;
  role?: "img";
}

export function chartA11yProps(title: string, description?: string): ChartA11yProps {
  const props: ChartA11yProps = { title, role: "img" };
  if (description !== undefined) {
    props.description = description;
  }
  return props;
}
