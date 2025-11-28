import type { ViteDevServer } from 'vite'

export function securityMiddleware(server: ViteDevServer) {
  server.middlewares.use((_req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com",
      "font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.roblox.com",
      "media-src 'self' https:",
      "frame-src 'self' https://www.roblox.com"
    ].join('; ')
    
    res.setHeader('Content-Security-Policy', csp)
    
    next()
  })
}
