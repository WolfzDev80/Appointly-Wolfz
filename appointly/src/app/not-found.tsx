import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-800 font-mono">404</p>
        <h1 className="mt-4 text-lg font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
