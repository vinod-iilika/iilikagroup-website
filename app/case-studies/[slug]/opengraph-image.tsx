import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'IILIKA GROUPS Case Study'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let title = 'Case Study'

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/case_studies?slug=eq.${slug}&status=eq.published&select=title&limit=1`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )
    const data = await res.json()
    if (data?.[0]?.title) title = data[0].title
  } catch {
    // fallback to default title
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#333333',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#FF000E',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
          }}
        >
          IILIKA GROUPS — Case Study
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? '40px' : '52px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: '80px',
            height: '4px',
            background: '#FF000E',
            borderRadius: '2px',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
