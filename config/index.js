module.exports = {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"

  siteTitle: 'James Faeldon', // Navigation and Site Title
  siteTitleAlt: 'James Faeldon - Personal Blog ', // Alternative Site title for SEO
  siteTitleManifest: 'James Faeldon',
  siteUrl: 'https://james.faeldon.com', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteHeadline: 'A personal commitment to working more in the open', // Headline for schema.org JSONLD
  siteBanner: '/social/banner.jpg', // Your image for og:image tag. You can find it in the /static folder
  favicon: 'src/favicon.png', // Your image for favicons. You can find it in the /src folder
  siteDescription:
    'Personal blog of James Faeldon topics range from  useful code snippets to passion projects and anything in between.', // Your site description
  author: 'James Faeldon', // Author for schemaORGJSONLD
  siteLogo: '/social/logo.png', // Image for schemaORGJSONLD

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  userTwitter: '@jafaeldon', // Twitter Username - Optional
  ogSiteName: 'James Faeldon', // Facebook Site Name - Optional
  ogLanguage: 'en_US', // Facebook Language
  googleAnalyticsID: 'UA-141571270-1',

  // Manifest and Progress color
  // See: https://developers.google.com/web/fundamentals/web-app-manifest/
  themeColor: '#3498DB',
  backgroundColor: '#2b2e3c',
}
