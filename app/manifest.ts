import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'STUvoice',
    short_name: 'STUvoice',
    description: "رأيك يصنع الفرق",
    start_url: '/',
    display: 'standalone',
    background_color: '#dbeafe',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}