FROM node:20.19.0 AS base
WORKDIR /app

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build with APP_ENV=staging so next.config.js loadEnv() reads
# .env.staging during compilation. Without this the build silently
# falls through to .env (NEXT_PUBLIC_ENV=dev, localhost domain) and
# the resulting bundle is mislabelled as a development build.
# The Order must place .env.staging next to the Dockerfile before
# `docker build` (file is gitignored — staging secrets stay host-side).
RUN yarn run build:staging

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.env.staging ./.env.staging

EXPOSE 3005
CMD ["yarn", "run", "start:staging"]
