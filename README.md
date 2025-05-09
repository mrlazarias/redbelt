# 🔔 Sistema de Alarmes de Segurança

Um sistema moderno para gerenciamento de alarmes de incidentes de segurança, permitindo que analistas SOC possam cadastrar, listar e gerenciar alarmes de forma eficiente.


## 📋 Sumário

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🔧 Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos para Instalação](#passos-para-instalação)
  - [Dados Iniciais e Seeders](#dados-iniciais-e-seeders)
  - [Criação de Usuários](#criação-de-usuários)
- [📖 Guia do Usuário](#-guia-do-usuário)
  - [Login e Navegação](#login-e-navegação)
  - [Dashboard](#dashboard)
  - [Gerenciamento de Alarmes](#gerenciamento-de-alarmes)
  - [Tipos de Alarme](#tipos-de-alarme)
  - [Temas e Configurações](#temas-e-configurações)
- [📝 Estrutura do Projeto](#-estrutura-do-projeto)
- [📚 API Endpoints](#-api-endpoints)
- [🧪 Testes](#-testes)
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
- Mínimo 4GB de RAM disponível
- Portas 5173, 8000, 3306 e 6379 livres no sistema

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/redbelt-test.git
cd redbelt-test
```

2. Configure o ambiente:
```bash
# Crie os arquivos de ambiente para backend e frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Execute o script de instalação (automatiza todo o processo):
```bash
bash install.sh
```

OU siga manualmente os passos:

```bash
# Inicie os containers
docker-compose up -d

# Execute as migrações e seeders do banco de dados
docker exec redbelt-backend php artisan migrate --seed

# Gere a chave da aplicação Laravel
docker exec redbelt-backend php artisan key:generate

# Limpe os caches
docker exec redbelt-backend php artisan cache:clear
docker exec redbelt-backend php artisan config:clear

# Gere os assets do frontend
docker exec redbelt-frontend npm run build
```

4. Acesse a aplicação:
```
Frontend: http://localhost:5173
Backend API: http://localhost:8000
```

### Dados Iniciais e Seeders

O sistema vem pré-configurado com dados iniciais para facilitar os testes. Ao executar o comando `php artisan migrate --seed`, os seguintes dados são criados:

#### Usuários de Teste
| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@example.com | password | Administrador |
| user@example.com | password | Usuário |

#### Tipos de Alarme Padrão
Os seguintes tipos de alarme são criados automaticamente:
- Malware Detectado
- Tentativa de Invasão
- Atividade Suspeita
- Falha de Autenticação
- Acesso Não Autorizado

#### Alarmes de Exemplo
São criados 20 alarmes de exemplo com diferentes criticidades, status e tipos para demonstrar o funcionamento do sistema.

Para verificar os detalhes dos seeders, veja os arquivos:
- `backend/database/seeders/UserSeeder.php` - Para usuários
- `backend/database/seeders/TipoAlarmeSeeder.php` - Para tipos de alarme
- `backend/database/seeders/AlarmeSeeder.php` - Para alarmes de exemplo

### Criação de Usuários

#### Via Interface (Frontend)
1. Acesse a página de registro em `http://localhost:5173/register`
2. Preencha os campos:
   - **Nome**: Nome completo
   - **E-mail**: Endereço de e-mail válido
   - **Senha**: Mínimo 8 caracteres
   - **Confirmar Senha**: Repita a senha
3. Clique em "Registrar"

#### Via CLI (Terminal)
```bash
# Acesse o container do backend
docker exec -it redbelt-backend bash

# Execute o comando Artisan para criar um usuário
php artisan user:create
```

Siga as instruções interativas para inserir o nome, e-mail e senha do novo usuário.

#### Via Tinker (Laravel Console)
```bash
# Acesse o container do backend
docker exec -it redbelt-backend bash

# Inicie o Tinker
php artisan tinker

# Crie um novo usuário
\App\Models\User::create([
    'name' => 'Nome do Usuário',
    'email' => 'email@exemplo.com',
    'password' => bcrypt('senha123'),
]);
```

## 📖 Guia do Usuário

### Login e Navegação

1. **Acesso ao Sistema**:
   - Abra seu navegador e acesse `http://localhost:5173`
   - Na tela de login, insira seu e-mail e senha
   - Clique em "Entrar" para acessar o sistema

2. **Navegação Principal**:
   - O menu lateral permite acesso rápido às principais funcionalidades:
     - **Dashboard**: Visualização geral com estatísticas
     - **Alarmes**: Lista e gerenciamento de alarmes
     - **Tipos de Alarme**: Gerenciamento de categorias de alarmes
   - No canto superior direito, você encontra:
     - Alternador de tema (claro/escuro)
     - Menu do usuário (perfil e logout)

### Dashboard

O Dashboard apresenta uma visão geral do sistema com gráficos e estatísticas importantes:

1. **Cartões de Resumo**:
   - Total de alarmes por status (Aberto, Em andamento, Fechado)
   - Distribuição por criticidade
   - Alarmes recentes

2. **Visualizações Gráficas**:
   - **Gráfico de Rosca**: Distribuição de alarmes por tipo
   - **Gráfico de Barras**: Alarmes por criticidade
   - **Gráfico de Barras**: Alarmes por status

3. **Lista de Últimos Alarmes**:
   - Mostra os alarmes mais recentes com links diretos para detalhes

### Gerenciamento de Alarmes

#### Listar Alarmes

1. Acesse a seção **Alarmes** no menu lateral
2. A lista de alarmes apresenta:
   - ID, título, tipo, status, criticidade e estado (ativo/inativo)
   - Ícones para editar e excluir cada registro
   - Destaque visual por criticidade e status (cores diferentes)

3. **Filtros disponíveis**:
   - **Status**: Filtre por Aberto, Em andamento ou Fechado
   - **Criticidade**: Filtre por Info, Baixo, Médio, Alto ou Crítico
   - **Tipo de Alarme**: Selecione um tipo específico
   - **Pesquisa**: Busque por título ou descrição

4. **Paginação**:
   - Navegue entre páginas usando os botões de paginação
   - Altere o número de itens por página (10, 25, 50)

#### Cadastrar Novo Alarme

1. Na tela de Alarmes, clique no botão **Novo Alarme**
2. Preencha o formulário com os dados do alarme:
   - **Nome do Alarme**: Título descritivo do incidente
   - **Tipo de Alarme**: Selecione um tipo existente ou crie um novo
   - **Descrição**: Detalhes do incidente
   - **Criticidade**: Selecione entre Informação, Baixo, Médio, Alto ou Crítico
   - **Status**: Aberto, Em andamento ou Fechado
   - **Data de Ocorrência**: Data e hora do incidente
   - **Ativo**: Marque para manter o alarme ativo

3. Clique em **Salvar** para cadastrar o alarme

#### Editar Alarme

1. Na lista de alarmes, clique no ícone de edição (lápis) do alarme desejado
2. Atualize os campos necessários no formulário
   - **Importante**: A data de ocorrência não pode ser alterada após a criação
3. Clique em **Salvar** para confirmar as alterações

#### Excluir Alarme

1. Na lista de alarmes, clique no ícone de exclusão (lixeira)
2. Confirme a exclusão na caixa de diálogo
   - **Nota**: Apenas alarmes com status "Aberto" podem ser excluídos

### Tipos de Alarme

Os tipos de alarme são categorias que podem ser personalizadas para classificar os incidentes.

#### Listar Tipos de Alarme

1. Acesse a seção **Tipos de Alarme** no menu lateral
2. A lista exibe todos os tipos cadastrados com ID, nome e ações disponíveis

#### Cadastrar Novo Tipo

1. Na tela de Tipos de Alarme, clique no botão **Novo Tipo**
2. Preencha o nome do novo tipo de alarme
3. Clique em **Salvar**

#### Editar Tipo de Alarme

1. Na lista de tipos, clique no ícone de edição (lápis)
2. Atualize o nome do tipo
3. Clique em **Salvar**

#### Excluir Tipo de Alarme

1. Na lista de tipos, clique no ícone de exclusão (lixeira)
2. Confirme a exclusão na caixa de diálogo
   - **Importante**: Tipos associados a alarmes existentes não podem ser excluídos

### Temas e Configurações

1. **Alternar Tema**:
   - Clique no ícone de sol/lua no canto superior direito da interface
   - O sistema alterna entre tema claro e escuro
   - A preferência de tema é salva e mantida entre sessões

2. **Logout**:
   - Clique no menu de usuário no canto superior direito
   - Selecione "Sair" para encerrar a sessão

## 📝 Estrutura do Projeto

```
redbelt-test/
├── backend/            # API Laravel
│   ├── app/            # Código da aplicação
│   │   ├── Http/       # Controllers, Middleware, Requests
│   │   ├── Models/     # Modelos da aplicação
│   │   └── Services/   # Serviços da aplicação
│   ├── database/       # Migrations, seeds e factories
│   ├── routes/         # Definição de rotas da API
│   ├── tests/          # Testes unitários e de integração
│   └── ...
├── frontend/           # Aplicação React
│   ├── src/            # Código fonte
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── redux/      # Configuração do Redux
│   │   ├── services/   # Serviços de API
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
- `POST /api/auth/register` - Registro de novo usuário

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

## 🧪 Testes

O projeto inclui testes unitários e de integração para garantir a qualidade do código.

### Executando os testes
```bash
# Acesse o container do backend
docker exec -it redbelt-backend bash

# Execute os testes
php artisan test

# Para visualizar a cobertura de testes (requer PHPUnit com XDebug)
XDEBUG_MODE=coverage php artisan test --coverage
```

### Cobertura de testes
Os testes cobrem:
- Autenticação (login, logout, registro)
- CRUD de Alarmes
- CRUD de Tipos de Alarme
- Validações de dados
- Regras de negócio específicas
