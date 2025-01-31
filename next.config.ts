import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty'],
};
 
export default withNextIntl(nextConfig);
