import Navigation from "@/components/homepage/layout/Navigation";
import "@/styles/globals.css";
import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const theme = extendBaseTheme({});

  return (
    <ChakraBaseProvider theme={theme}>
      <Navigation>
        <Component {...pageProps} />
      </Navigation>
    </ChakraBaseProvider>
  );
}
