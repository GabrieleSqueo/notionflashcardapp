export const Metadata = {
    title: "NotionFlashcard",
    description: "Boost your grades with NotionFlashcard by creating and reviewing flashcards directly in Notion.",
    appleTouchIcons: [
        { rel: "apple-touch-icon", sizes: "57x57", href: "./favicon/apple-icon-57x57.png" },
        { rel: "apple-touch-icon", sizes: "60x60", href: "./favicon/apple-icon-60x60.png" },
        { rel: "apple-touch-icon", sizes: "72x72", href: "./favicon/apple-icon-72x72.png" },
        { rel: "apple-touch-icon", sizes: "76x76", href: "./favicon/apple-icon-76x76.png" },
        { rel: "apple-touch-icon", sizes: "114x114", href: "./favicon/apple-icon-114x114.png" },
        { rel: "apple-touch-icon", sizes: "120x120", href: "./favicon/apple-icon-120x120.png" },
        { rel: "apple-touch-icon", sizes: "144x144", href: "./favicon/apple-icon-144x144.png" },
        { rel: "apple-touch-icon", sizes: "152x152", href: "./favicon/apple-icon-152x152.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "./favicon/apple-icon-180x180.png" },
    ],
    icons: [
        { rel: "icon", type: "image/png", sizes: "192x192", href: "./favicon/android-icon-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "./favicon/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "./favicon/favicon-96x96.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "./favicon/favicon-16x16.png" },
        { rel: "manifest", href: "/manifest.json" },
    ],
    meta: {
        msapplicationTileColor: "#ffffff",
        msapplicationTileImage: "/ms-icon-144x144.png",
        themeColor: "#ffffff",

        // Open Graph Metadata
        ogTitle: "NotionFlashcard - Boost Your Grades",
        ogDescription: "Enhance your learning experience directly in Notion. Create interactive flashcards effortlessly.",
        ogUrl: "https://notionflashcard.com",
        ogType: "website",
        ogImage: "./openGraph.png",
        ogImageAlt: "Preview of NotionFlashcard in action",
        ogImageWidth: "1200",
        ogImageHeight: "630",

        // Twitter Cards Metadata
        twitterCard: "summary_large_image",
        twitterTitle: "NotionFlashcard - Boost Your Learning in Notion",
        twitterDescription: "Create and review flashcards seamlessly inside Notion.",
        // Additional Meta
        viewport: "width=device-width, initial-scale=1.0",
        robots: "index, follow",
    },

    // Dublin Core Metadata
    dublinCore: {
        title: "NotionFlashcard",
        description: "Boost your grades with NotionFlashcard",
        subject: "Education, Flashcards, Notion, Productivity",
        creator: "Luca Landriscina and Gabriele Squeo", // Inserisci il tuo nome o il nome dell'azienda
    },

    // Schema.org JSON-LD Metadata
    jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "NotionFlashcard",
        url: "https://notionflashcard.com",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://notionflashcard.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        description: "Boost your grades with NotionFlashcard by creating and reviewing flashcards directly in Notion.",
    },
};
