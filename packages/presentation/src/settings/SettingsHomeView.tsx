import type { CSSProperties } from "react";

import { color, spacing, typography } from "@conquest/gis";



export interface SettingsCategoryLink {

  id: string;

  label: string;

  route: string;

}



export interface SettingsHomeViewProps {

  categories: SettingsCategoryLink[];

}



const linkStyle: CSSProperties = {

  display: "block",

  padding: spacing.md,

  border: `1px solid ${color.border}`,

  borderRadius: "0.5rem",

  marginBottom: spacing.sm,

  color: color.textPrimary,

  textDecoration: "none",

};



/** SET-01 — Settings Home. Presentation only. */

export function SettingsHomeView({ categories }: SettingsHomeViewProps) {

  return (

    <section aria-labelledby="settings-home-heading">

      <h1 id="settings-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>

        Settings

      </h1>

      <nav aria-label="Settings categories">

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

          {categories.map((category) => (

            <li key={category.id}>

              <a href={category.route} style={linkStyle}>

                {category.label}

              </a>

            </li>

          ))}

        </ul>

      </nav>

    </section>

  );

}

