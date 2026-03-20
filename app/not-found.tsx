import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 px-6 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-xl text-gray-400">
        Page not found. The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/en"
          className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Go Home
        </Link>
        <Link
          href="/en/blog"
          className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-500"
        >
          Read Blog
        </Link>
      </div>
    </div>
  )
}
