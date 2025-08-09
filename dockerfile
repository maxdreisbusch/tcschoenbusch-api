# --- Stage 1: Build Stage ---
    FROM node:22-alpine AS builder

    RUN apk add openssl

    WORKDIR /app
    
    # Install dependencies only
    COPY package*.json ./
    #RUN npm ci --omit=dev
    RUN npm ci
    
    # Copy source files and Prisma schema
    COPY . .
    
    # Generate Prisma client (keep only output, not full Prisma CLI)
    RUN npx prisma generate
    
    # Optional: Build TypeScript (if using TS)
    RUN node build.mjs
    
    # --- Stage 2: Production Stage ---
    FROM node:22-alpine

    RUN apk add openssl
    
    WORKDIR /app
    
    # Copy only runtime-needed files
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/dist/server ./dist
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/generated ./generated
    
    # Copy any runtime entry script if needed
    COPY entrypoint.sh ./entrypoint.sh
    RUN chmod +x ./entrypoint.sh
    
    # Set production environment
    ENV NODE_ENV=production
    
    ENTRYPOINT ["./entrypoint.sh"]
    