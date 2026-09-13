// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JustJobNG – Find Your Next Job',
    short_name: 'JustJobNG',
    description: "Nigeria's No. 1 job aggregator platform. Browse live listings, apply to top Jobs, and grow your career. Subscribe via *7098#.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0A0F1C',
    theme_color: '#0A0F1C',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}