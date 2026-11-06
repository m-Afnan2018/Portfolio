export interface PipelineStage {
  id: string;
  label: string;
  detail: string;
  cmd: string;
}

export const pipeline: PipelineStage[] = [
  { id: "push", label: "git push", detail: "main ← feature/*", cmd: "git push origin main" },
  { id: "actions", label: "GitHub Actions", detail: "lint · typecheck · test", cmd: "gh run watch" },
  { id: "docker", label: "Docker build", detail: "multi-stage → registry", cmd: "docker build -t app:sha ." },
  { id: "deploy", label: "Deploy", detail: "EC2 / Lightsail / VPS", cmd: "docker compose up -d" },
  { id: "nginx", label: "Nginx + SSL", detail: "reverse proxy · certbot", cmd: "nginx -s reload" },
  { id: "live", label: "Live", detail: "200 OK · zero downtime", cmd: "curl -I https://…" },
];

export const infraStats = ["20+ sites managed", "Docker", "AWS EC2 · Lightsail", "CI/CD", "Nginx + Certbot"];

export const infraFiles: { name: string; lang: string; code: string }[] = [
  {
    name: "docker-compose.yml",
    lang: "yaml",
    code: `services:
  app:
    image: ghcr.io/client/app:\${GIT_SHA}
    restart: unless-stopped
    env_file: .env.production
    depends_on: [mongo]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s

  mongo:
    image: mongo:8
    restart: unless-stopped
    volumes: [mongo-data:/data/db]

  nginx:
    image: nginx:1.27-alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on: [app]

volumes:
  mongo-data:`,
  },
  {
    name: "nginx.conf",
    lang: "nginx",
    code: `server {
  listen 443 ssl http2;
  server_name client.example.com;

  ssl_certificate     /etc/letsencrypt/live/client/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/client/privkey.pem;

  gzip on;
  gzip_types text/css application/javascript application/json;

  location /_next/static/ {
    proxy_pass http://app:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location / {
    proxy_pass         http://app:3000;
    proxy_set_header   Host $host;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
  }
}`,
  },
  {
    name: "deploy.yml",
    lang: "yaml",
    code: `name: deploy
on:
  push:
    branches: [main]

jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run lint && npm run build
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/client/app:\${{ github.sha }}
      - name: roll out
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS_HOST }}
          script: |
            cd /srv/app && GIT_SHA=\${{ github.sha }} docker compose up -d
            docker image prune -f`,
  },
];
