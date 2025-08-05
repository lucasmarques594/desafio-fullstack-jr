# Etapa base (compartilhada)
FROM oven/bun:slim AS base
WORKDIR /app
COPY bun.lock package.json tsconfig.json ./
RUN bun install --frozen-lockfile

# Etapa de build
FROM base AS build
COPY ./src ./src
ENV NODE_ENV=production
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/main.ts

# Etapa de produção
FROM debian:bookworm-slim AS production
WORKDIR /app
COPY --from=build /app/server ./server
COPY .env .env
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./server"]

# Etapa de desenvolvimento
FROM base AS development
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "dev"]
