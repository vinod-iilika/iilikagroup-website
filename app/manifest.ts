import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IILIKA GROUPS',
    short_name: 'IILIKA',
    description: 'IT Staffing, GCC Enablement & Project Delivery for modern enterprises.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF000E',
    icons: [
      {
        src: '/images/iilika-groups.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/images/iilika-groups-large.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  }
}
