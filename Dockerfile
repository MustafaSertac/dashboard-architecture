# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# EduCoach (ProKoc) frontend — Next.js 16 (App Router) production image
# Cok asamali build: bagimliliklar -> build -> calisma (standalone).
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- 1) Bagimliliklar -----------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2) Build -------------------------------------------------------------
# NEXT_PUBLIC_* degerleri build zamaninda bundle'a gomulur; bu yuzden
# API adresi build arg'i olarak verilmelidir.
FROM base AS builder
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1.0
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 3) Calisma -----------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# standalone cikti kendi server.js'ini ve minimal node_modules'ini icerir.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
