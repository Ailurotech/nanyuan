import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const buttonLink = defineStyle({
  fontSize: "1.125rem",
  lineHeight: "1.75rem",
  color: "#ffffff",
  display: "none",
  " @media (max-width:768px)": {
    display: "block",
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { buttonLink },
});
