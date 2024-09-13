import Navigation from "@/components/homepage/layout/Navigation";
import { buttonTheme } from "@/components/styles/button-style";
import "@/styles/globals.css";
import {
  ChakraProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const { Button, Drawer } = chakraTheme.components;

  const theme = extendBaseTheme({
    components: {
      Button: buttonTheme,
      Drawer,
    },
  });

  return (
    <ChakraProvider theme={theme}>  
      <Navigation>
        <Component {...pageProps} />
      </Navigation>
    </ChakraProvider>
  );
}
