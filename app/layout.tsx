import { Metadata } from "./metadata";

export const metadata = {
  title: "NotionFlashcard",
  description: "Less Confusion Higher Grades",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* SEO e accessibilità */}
        <meta name="viewport" content={Metadata.meta.viewport} />
        <meta charSet="UTF-8" />
        <meta name="description" content={Metadata.description} />
        <meta name="robots" content={Metadata.meta.robots} />

        {/* Open Graph Meta */}
        <meta property="og:title" content={Metadata.meta.ogTitle} />
        <meta property="og:description" content={Metadata.meta.ogDescription} />
        <meta property="og:url" content={Metadata.meta.ogUrl} />
        <meta property="og:type" content={Metadata.meta.ogType} />
        <meta property="og:image" content={Metadata.meta.ogImage} />
        <meta property="og:image:alt" content={Metadata.meta.ogImageAlt} />
        <meta property="og:image:width" content={Metadata.meta.ogImageWidth} />
        <meta property="og:image:height" content={Metadata.meta.ogImageHeight} />

        {/* Twitter Meta */}
        <meta name="twitter:card" content={Metadata.meta.twitterCard} />
        <meta name="twitter:title" content={Metadata.meta.twitterTitle} />
        <meta name="twitter:description" content={Metadata.meta.twitterDescription} />

        {/* Additional Meta */}
        <meta name="msapplication-TileColor" content={Metadata.meta.msapplicationTileColor} />
        <meta name="msapplication-TileImage" content={Metadata.meta.msapplicationTileImage} />
        <meta name="theme-color" content={Metadata.meta.themeColor} />

        {/* Dublin Core Meta */}
        <meta name="DC.title" content={Metadata.dublinCore.title} />
        <meta name="DC.description" content={Metadata.dublinCore.description} />
        <meta name="DC.subject" content={Metadata.dublinCore.subject} />
        <meta name="DC.creator" content={Metadata.dublinCore.creator} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(Metadata.jsonLd) }} />

        {/* Apple Icons e altre icone */}
        {Metadata.appleTouchIcons.map((icon) => (
          <link key={icon.sizes} rel={icon.rel} sizes={icon.sizes} href={icon.href} />
        ))}
        {Metadata.icons.map((icon) => (
          <link key={icon.sizes || icon.rel} rel={icon.rel} type={icon.type} sizes={icon.sizes} href={icon.href} />
        ))}

        {/* Canonical URL */}
        <link rel="canonical" href={Metadata.meta.ogUrl} />
      </head>
      <body>{children}</body>
    </html>
  )
}
