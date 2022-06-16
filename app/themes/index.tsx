import { MantineProvider } from "@mantine/core";
import type { MantineThemeOverride } from "@mantine/core";
import React from "react";

const myTheme: MantineThemeOverride = {
  colorScheme: "dark",
  primaryColor: "red",
  primaryShade: { dark: 8, light: 9 },
  loader: "bars",
};
const ThemeProvider: React.FC = ({ children }) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={myTheme}>
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
