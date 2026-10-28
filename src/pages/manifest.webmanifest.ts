import type { APIRoute } from 'astro'
import { getImage } from 'astro:assets'
import config from '../config'
import favicon from '../favicon.png'

// What gatsby-plugin-manifest generated: the app manifest, with icons resized from src/favicon.png.
export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    [192, 512].map(async (size) => {
      const image = await getImage({ src: favicon, width: size, height: size, format: 'png' })
      return { src: image.src, sizes: `${size}x${size}`, type: 'image/png' }
    }),
  )
  const manifest = {
    name: config.siteTitleAlt,
    short_name: config.siteTitleManifest,
    description: config.siteDescription,
    start_url: '/',
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    display: 'standalone',
    icons,
  }
  return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/manifest+json' } })
}
