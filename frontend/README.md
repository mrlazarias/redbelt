# Frontend - Sistema de Gerenciamento de Alarmes

Este é o frontend da aplicação de gerenciamento de alarmes, construído com React, Vite, React Router DOM e Tailwind CSS.

## Tecnologias utilizadas

- **React 19**: Biblioteca JavaScript para construção de interfaces
- **Vite**: Build tool para desenvolvimento rápido
- **React Router DOM**: Gerenciamento de rotas
- **Tailwind CSS**: Framework de CSS utilitário
- **Axios**: Cliente HTTP para comunicação com a API
- **React Hook Form**: Gerenciamento de formulários

## Estrutura do projeto

```
frontend/
├── public/              # Arquivos públicos
├── src/                 # Código fonte
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React (AuthContext)
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços (API)
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── .env                 # Variáveis de ambiente
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências e scripts
└── vite.config.js       # Configuração do Vite
```

## Funcionalidades

- Autenticação de usuários (login/registro)
- Dashboard com visão geral dos alarmes
- CRUD de alarmes
- CRUD de tipos de alarme
- Filtragem e paginação dos dados
- Design responsivo

## Como executar

1. Clone o repositório
2. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Copie o arquivo `.env.example` para `.env` e configure a URL da API:
   ```bash
   cp .env.example .env
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse a aplicação em: `http://localhost:5173`

## Construção para produção

Para gerar a versão de produção, execute:
```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` prontos para serem implantados em qualquer servidor web estático.

## Integração com o backend

O frontend se comunica com a API Laravel através do serviço Axios configurado. Certifique-se de que o backend está em execução e acessível na URL configurada no arquivo `.env`.
