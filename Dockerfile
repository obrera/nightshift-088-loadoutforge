FROM oven/bun:1.3.12 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
RUN bun run build

FROM oven/bun:1.3.12 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9876
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/dist ./dist
EXPOSE 9876
CMD ["bun", "run", "start"]
