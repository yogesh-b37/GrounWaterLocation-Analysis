FROM node:18-bullseye-slim

# Install Python and build tools
RUN apt-get update && apt-get install -y python3 python3-pip build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy application code
COPY backend ./backend
COPY ai-model ./ai-model

# Install AI model Python dependencies if present
RUN if [ -f ai-model/requirements.txt ]; then pip3 install --no-cache-dir -r ai-model/requirements.txt; fi

WORKDIR /usr/src/app/backend

ENV PYTHON_PATH=/usr/bin/python3
ENV PORT=3003

EXPOSE 3003

RUN mkdir -p uploads reports

CMD ["node", "server.js"]
