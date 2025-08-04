# Estágio 1: Build
FROM oven/bun:latest

WORKDIR /usr/src/app

# 1. Copia APENAS o package.json.
#    Isso otimiza o cache do Docker. O passo de instalação só será
#    executado novamente se o package.json mudar.
COPY package.json ./

# 2. Roda 'bun install' para criar o bun.lockb e instalar as dependências
#    DENTRO do próprio container. Note que não usamos --frozen-lockfile.
RUN bun install

# 3. Agora, copia o resto do código da sua aplicação (pasta src, etc).
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["bun", "run", "src/main.ts"]