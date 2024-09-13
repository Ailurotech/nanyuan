import { ChakraProvider } from "@chakra-ui/react";  // 引入 ChakraProvider
import Navigation from "@/components/homepage/layout/Navigation";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>  {/* 用 ChakraProvider 包裹 */}
      <Navigation>
        <Component {...pageProps} />
      </Navigation>
    </ChakraProvider>
  );
}
