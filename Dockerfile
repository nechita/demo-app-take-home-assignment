FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS dev
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS builder
COPY . .
ARG NEXT_PUBLIC_API_URL=https://randomuser.me/api/1.4
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

FROM node:22-alpine AS prod
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/types ./types
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/components.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/ecosystem.config.js ./
COPY --from=builder /app/.env.local ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "start"]