import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/signup']
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/dashboard/admin'],
  staff: ['/dashboard/staff'],
  client: ['/dashboard/client'],
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (user) {
      return redirectToDashboard(request, supabase)
    }
    return response
  }

  // Require auth for all other routes
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Role-based route protection
  if (pathname.startsWith('/dashboard')) {
    return handleDashboardAccess(request, response, supabase, user.id, pathname)
  }

  return response
}

async function redirectToDashboard(request: NextRequest, supabase: ReturnType<typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.next({ request })

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'client'
  return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
}

async function handleDashboardAccess(
  request: NextRequest,
  response: NextResponse,
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  pathname: string
) {
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  const role = profile?.role || 'client'
  const allowedPaths = ROLE_ROUTES[role] || []
  const hasAccess = allowedPaths.some(path => pathname.startsWith(path))

  if (!hasAccess && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
