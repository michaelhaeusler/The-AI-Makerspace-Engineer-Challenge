/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed the problematic rewrite rule that was causing redirect loops
  // Vercel handles API routing differently than local development
}

module.exports = nextConfig
