export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/projects/:path*',
    '/admin/faqs/:path*',
    '/admin/callbacks/:path*',
    '/admin/stats/:path*',
  ],
};
