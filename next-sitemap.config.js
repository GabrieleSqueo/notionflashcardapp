module.exports = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true, // Genera anche robots.txt
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://notionflashcard.com/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        disallow: '/api',
        allow: '/',
      },
    ],
  },
  sitemapSize: 7000,
  changefreq: 'weekly', // Cambiato in 'weekly' per una frequenza più attiva
  priority: 0.7,

  transform: async (config, url) => {
    if (url === 'https://notionflashcard.com/') {
      return {
        loc: url,
        changefreq: 'daily', // Frequenza più alta per la landing page
        priority: 1.0, // Priorità massima
        lastmod: new Date().toISOString(), // Data ultima modifica
        images: [
          {
            url: 'https://notionflashcard.com/_next/image?url=/_next/static/media/quizlet.562f7d85.png&w=1200&q=75', // Ottimizza immagini
            caption: 'Quizlet logo',
            title: 'The quizlet logo',
          },
          {
            url: 'https://notionflashcard.com/_next/image?url=/_next/static/media/anki.938ae3ef.png&w=1920&q=75', // Ottimizza immagini
            caption: 'Anki logo',
            title: 'The Anki logo',
          },
          {
            url: 'https://notionflashcard.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgizmo.3703230e.png&w=1200&q=75', // Ottimizza immagini
            caption: 'Gizmo logo',
            title: 'The Gizmo logo',
          },
          {
            url: 'https://notionflashcard.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fremnote.a2e0120f.png&w=1200&q=75', // Ottimizza immagini
            caption: 'Remnote logo',
            title: 'The Remnote logo',
          },
          {
            url: 'https://notionflashcard.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.4d318446.png&w=128&q=75', // Ottimizza immagini
            caption: 'NotionFlashcard logo',
            title: 'The NotionFlashcard logo',
          },
          {
            url: 'https://notionflashcard.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fus.3736e96a.png&w=3840&q=75', // Ottimizza immagini
            caption: 'An photo of the working team',
            title: 'The team',
          },
        ],
      };
    }

    return {
      loc: url,
      changefreq: 'weekly', // Frequenza default
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
