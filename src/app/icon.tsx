import { ImageResponse } from 'next/og'
// Ensure static export compatibility
export const dynamic = 'force-static'
export const revalidate = false
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAF9F7',
          borderRadius: '20%',
          fontWeight: 'bold',
          fontFamily: 'serif',
        }}
      >
        🪵
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
