'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ fontFamily: 'monospace', padding: '2rem', background: '#fff' }}>
        <h2 style={{ color: 'red' }}>Server Error — Debug Info</h2>
        <p><strong>Message:</strong> {error.message}</p>
        <p><strong>Digest:</strong> {error.digest}</p>
        <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', fontSize: '0.75rem' }}>
          {error.stack}
        </pre>
      </body>
    </html>
  )
}
