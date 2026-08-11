
const nextConfig = {
  /** Dev-only: avoids double-mounting every component (faster HMR). */
  reactStrictMode: process.env.NODE_ENV === "production",
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["pino-pretty"],
  /** Smaller dev/prod bundles — import only used icons/components. */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-accordion",
      "@radix-ui/react-scroll-area",
    ],
  },
  turbopack: {
    resolveAlias: {
      wagmi: "./src/shims/wagmi.tsx",
      "wagmi/chains": "./src/shims/wagmi-chains.ts",
      "wagmi/connectors": "./src/shims/wagmi-connectors.ts",
      "@rainbow-me/rainbowkit": "./src/shims/rainbowkit.tsx",
      "@rainbow-me/rainbowkit/styles.css": "./src/shims/empty.css",
      "convex/react": "./src/shims/convex-react.tsx",
      "socket.io-client": "./src/shims/socket-io-client.ts",
      ethers: "./src/shims/ethers.ts",
      viem: "./src/shims/viem.ts",
      "viem/chains": "./src/shims/viem-chains.ts",
      axios: "./src/shims/axios.ts",
      gsap: "./src/shims/gsap.ts",
      "gsap/ScrollTrigger": "./src/shims/gsap-scroll-trigger.ts",
      three: "./src/shims/three.ts",
      "livekit-client": "./src/shims/livekit-client.ts",
      "@livekit/components-react": "./src/shims/livekit-components-react.tsx",
      "@livekit/components-styles": "./src/shims/empty.css",
      uuid: "./src/shims/uuid.ts",
      "use-debounce": "./src/shims/use-debounce.ts",
      "react-intersection-observer": "./src/shims/react-intersection-observer.ts",
      lenis: "./src/shims/lenis.ts",
      "@studio-freight/lenis": "./src/shims/lenis.ts",
      postprocessing: "./src/shims/postprocessing.ts",
      "@react-jvectormap/world": "./src/shims/jvectormap-world.ts",
      "@react-oauth/google": "./src/shims/react-oauth-google.tsx",
      "@tanstack/react-query": "./src/shims/tanstack-react-query.tsx",
      "@gsap/react": "./src/shims/gsap-react.ts",
      "@react-jvectormap/core": "./src/shims/jvectormap-core.tsx",
      "convex/values": "./src/shims/convex-values.ts",
      "convex/server": "./src/shims/convex-server.ts",
    },
  },
  images: {
    /** Skip server-side fetch/proxy in dev — prevents Unsplash upstream timeouts. */
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;