import Navigation from "@/components/homepage/layout/Navigation";
import { buttonTheme } from "@/components/styles/button-style";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "@/styles/globals.css";
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const { Radio, Button, Drawer, Input, Textarea } = chakraTheme.components;

  const theme = extendBaseTheme({
    components: {
      Button: buttonTheme,
      Drawer,
      Radio,
      Input,
      Textarea,
    },
  });

  return (
    <ChakraBaseProvider theme={theme}>
      <Navigation>
        <Component {...pageProps} />
      </Navigation>
    </ChakraBaseProvider>
  );
}
