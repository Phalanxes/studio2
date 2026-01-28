# Use the official Node.js image as the base
FROM node:20-slim AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Install libc6-compat might be needed for some native dependencies
# Install ffmpeg here if needed for build scripts, but crucial for the runner
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build time (if needed)
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Install ffmpeg in the runner image (CRITICAL STEP)
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# You need to update next.config.ts to use output: 'standalone' for this to work optimally
# For now, we will copy the standard build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
