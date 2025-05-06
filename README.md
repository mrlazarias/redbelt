# 🔔 Sistema de Alarmes de Segurança

Um sistema moderno para gerenciamento de alarmes de incidentes de segurança, permitindo que analistas SOC possam cadastrar, listar e gerenciar alarmes de forma eficiente.

![Redbelt Security Alarm System](https://via.placeholder.com/800x400/0A84FF/FFFFFF?text=Redbelt+Security+Alarm+System)

## 📋 Sumário

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [📝 Estrutura do Projeto](#-estrutura-do-projeto)
- [📚 API Endpoints](#-api-endpoints)
- [👥 Autores](#-autores)

## 🚀 Sobre o Projeto

O Sistema de Alarmes de Segurança foi desenvolvido para atender às necessidades de equipes de segurança da informação, permitindo uma reação rápida a incidentes. A plataforma oferece uma interface intuitiva para gerenciar alarmes, com recursos de filtragem, categorização por criticidade e acompanhamento de status.

## ✨ Funcionalidades

- **Autenticação Segura**: Sistema de login com e-mail e senha
- **Gerenciamento de Alarmes**: CRUD completo seguindo as regras de negócio
- **Listagem Avançada**: Paginação, ordenação e filtros por todos os campos
- **Dashboard Analítico**: Visualização de estatísticas e métricas importantes
- **Theme Switcher**: Suporte a modo claro e escuro
- **Containerização**: Ambiente completo em Docker para fácil configuração

## 🛠️ Tecnologias Utilizadas

### Backend
- Laravel 12
- PHP 8.3
- MySQL 8
- PHPUnit para testes
- Redis para filas

### Frontend
- React 19
- Vite
- Redux para gerenciamento de estado
- Tailwind CSS para estilização
- Chart.js para visualizações gráficas

### Infraestrutura
- Docker e docker-compose
- Nginx como servidor web


### MVP (Requisitos Obrigatórios)
- ✅ Login (Autenticação com e-mail e senha)
- ✅ CRUD de Alarmes completo
- ✅ Listagem com paginação, ordenação e filtros
- ✅ Docker (ambiente completo via docker-compose)
- ✅ Testes Unitários (cobertura de 100%)
- ✅ Redux para gerenciamento de estado

### Regras de Negócio
- ✅ Criticidade (0=info, 1=baixo, 2=médio, 3=alto, 4=crítico)
- ✅ Status (1=aberto, 2=em andamento, 0=fechado)
- ✅ Ativo (1=ativo, 0=desativado)
- ✅ Soft-delete (apenas se status=1)
- ✅ Datas imutáveis (data_ocorrencia e created_at)
- ✅ Tipos de Alarme dinâmicos


## 🔧 Instalação e Execução

### Pré-requisitos
- Docker e docker-compose instalados
- Git

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/redbelt-test.git
cd redbelt-test
```

2. Configure o ambiente:
```bash
cp .env.example .env
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Acesse a aplicação:
```
Frontend: http://localhost:3000
Backend API: http://localhost:8000
```

### Usuários de Teste

| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@example.com | password | Administrador |
| user@example.com | password | Usuário |

## 📝 Estrutura do Projeto

```
redbelt-test/
├── backend/            # API Laravel
│   ├── app/            # Código da aplicação
│   ├── database/       # Migrations, seeds e factories
│   ├── tests/          # Testes unitários e de integração
│   └── ...
├── frontend/           # Aplicação React
│   ├── src/            # Código fonte
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── redux/      # Configuração do Redux
│   │   └── ...
│   └── ...
├── docker/             # Configurações do Docker
├── docker-compose.yml  # Definição dos serviços
└── README.md           # Este arquivo
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout de usuário

### Alarmes
- `GET /api/alarmes` - Listar alarmes (com suporte a filtros)
- `GET /api/alarmes/{id}` - Obter detalhes de um alarme
- `POST /api/alarmes` - Criar um novo alarme
- `PUT /api/alarmes/{id}` - Atualizar um alarme existente
- `DELETE /api/alarmes/{id}` - Excluir um alarme (soft-delete)

### Tipos de Alarme
- `GET /api/tipos-alarme` - Listar tipos de alarme
- `POST /api/tipos-alarme` - Criar um novo tipo de alarme
- `PUT /api/tipos-alarme/{id}` - Atualizar um tipo de alarme
- `DELETE /api/tipos-alarme/{id}` - Excluir um tipo de alarme

### Estatísticas
- `GET /api/stats/alarmes` - Estatísticas gerais de alarmes
