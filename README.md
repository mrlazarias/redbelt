# Alarme Monorepo

## Setup

1. Clone o repositório
2. Copie `.env.example` para `.env` em backend e frontend
3. Rode `docker-compose up --build`
4. Acesse o backend em http://localhost:8000 e o frontend em http://localhost:5173

## Comandos úteis

- `docker-compose exec app php artisan migrate`
- `docker-compose exec app php artisan db:seed`