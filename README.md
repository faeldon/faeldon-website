# James Faeldon Blog

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://raw.githubusercontent.com/faeldon/faeldon-website/master/LICENSE)
[![CircleCI](https://circleci.com/gh/faeldon/faeldon-website.svg?style=svg)](https://circleci.com/gh/faeldon/faeldon-website)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9289d080-75b7-43d4-bf90-16af8b0467da/deploy-status)](https://app.netlify.com/sites/faeldon/deploys)
[![Chat with me at https://gitter.im/faeldon/faeldon-website](https://badges.gitter.im/faeldon/faeldon-website.svg)](https://gitter.im/faeldon/faeldon-website?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[View the Website](https://james.faeldon.com)

Typography driven blog site, focus on the content, code & minimal style.

It follows the [JAMstack architecture](https://jamstack.org) by using Git as a single source of truth, and [Netlify](https://www.netlify.com) for continuous deployment, and CDN distribution.

This repo is built with [Gatsby](https://www.gatsbyjs.org/), and [Netlify](https://www.netlify.com)

Web design by [LekoArts Minimal Blog](https://github.com/LekoArts/gatsby-starter-minimal-blog)

## Features

- Articles in MDX ([gatsby-mdx](https://github.com/ChristopherBiscardi/gatsby-mdx))
- Code highlighting (with [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer)) and live preview (with [react-live](https://github.com/FormidableLabs/react-live))
- Styled Components 💅
- Netlify Contact Form
- Categories
- Offline Support
- WebApp Manifest Support
- SEO
  - Sitemap
  - Schema.org JSONLD
  - OpenGraph Tags
  - Twitter Tags

## Getting Started (Recommended)

Netlify can run in any frontend web environment, but the quickest way
to try it out is by running it on a pre-configured starter site with
Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/faeldon/faeldon-website)

After clicking the link, you’ll authenticate with GitHub and choose a
repository name. Netlify will then automatically create a repository
in your GitHub account with a copy of the files from the template.

Finally, it will build and deploy the new site on Netlify, bringing you
to the site dashboard when the build is complete.


### Develop Locally
```
$ git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git
$ cd [REPO_NAME]
$ npm install
$ npm run develop
```

# CONTRIBUTING

Contributions are always welcome, no matter how large or small. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).
