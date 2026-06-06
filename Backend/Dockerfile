FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=backend:nodejs src ./src
USER backend
EXPOSE 4000
CMD ["node", "src/index.js"]
