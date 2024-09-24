import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        {/* Add other meta tags and links as needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}