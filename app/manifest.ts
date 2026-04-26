import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Live-dent',
    short_name: 'Live-dent',
    description: "Live-dent is a web application designed to help dental professionals manage their appointments, patient records, and other essential tasks efficiently. With a user-friendly interface and powerful features, Live-dent aims to streamline the workflow of dental practices and enhance patient care.",
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