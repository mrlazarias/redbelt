# Sistema de Alarmes de Segurança - Redbelt

Sistema de gerenciamento de alarmes de segurança desenvolvido como teste técnico para a Redbelt.

## Requisitos MVP (Atendidos)

- ✅ Login: Autenticação simples (e-mail + senha) utilizando Laravel Sanctum
- ✅ CRUD de Alarmes: API REST completa com todas as regras de negócio
- ✅ Listagem: Endpoint com paginação, ordenação e filtros por todos os campos
- ✅ Docker: Ambiente completo configurado com docker-compose
- ✅ Testes Unitários: Cobertura de testes no backend
- ✅ Redux: Estado global mantido em Redux

## Tecnologias

- **Backend**: Laravel 12, PHP 8.3, MySQL 8
- **Frontend**: React 19, Vite, Redux Toolkit
- **Docker**: Containers para backend, frontend, MySQL e Redis

## Setup

1. Clone o repositório
2. Copie `.env.example` para `.env` em backend e frontend
3. Execute `docker-compose up --build`
4. Acesse o backend em http://localhost:8000 e o frontend em http://localhost:5173

## Comandos úteis

- `docker-compose exec backend php artisan migrate` - Executar migrações do banco de dados
- `docker-compose exec backend php artisan db:seed` - Popular o banco com dados iniciais
- `docker-compose exec backend php artisan test` - Executar testes unitários

## Estrutura do Redux

O estado global da aplicação é gerenciado pelo Redux Toolkit, com os seguintes slices:

- **authSlice**: Gerencia autenticação, usuário atual e estado de login
- **alarmeSlice**: Gerencia operações CRUD para alarmes, paginação e filtros
- **tipoAlarmeSlice**: Gerencia tipos de alarme disponíveis

## Funcionalidades

- Login e registro de usuários
- CRUD completo de alarmes de segurança
- Filtros e paginação na listagem de alarmes
- Gestão de tipos de alarme
- Validação por regras de negócio definidas