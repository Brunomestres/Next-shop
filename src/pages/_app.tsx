import type { AppProps } from "next/app";
import Image from 'next/image'
import { globalStyles } from "@/styles/global";
import Logo from "@/assets/logo.svg"
import { Container, Header } from "@/styles/pages/app";
globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
      <Image src={Logo} alt="Logo Ignite"/>
      </Header>
    <Component {...pageProps} />
    </Container>
    );
}
