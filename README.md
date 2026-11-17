# 💻 ERP Distribuidora — Front-end (Web)

Interface web moderna e responsiva do **ERP Distribuidora**, desenvolvida para oferecer agilidade operacional na gestão de clientes, fornecedores, estoque e vendas, com foco em usabilidade e migração de processos baseados em planilhas de Excel.

> ⚙️ **Repositório Back-end:** [Acessar ERP Distribuidora API](https://github.com/Rogerio-Leal/erp-distribuidora-api)  
> 📊 **Gestão Ágil (Kanban):** [Acompanhar Sprints no GitHub Projects](https://github.com/users/Rogerio-Leal/projects/1)

---

## 🚀 Tecnologias Utilizadas

* **React & Vite** — Construção de interfaces reativas com build ultrarrápido
* **TypeScript** — Segurança de tipos na comunicação com a API e estados da aplicação
* **Tailwind CSS** — Estilização utilitária com tema **Dark Mode** nativo
* **React Router DOM** — Roteamento SPA com proteção de rotas privadas (`PrivateRoute`)
* **Zustand** — Gerenciamento de estado global de autenticação
* **Axios** — Cliente HTTP para integração com o Back-end
* **ViaCEP API** — Consulta automática de endereços por CEP

---

## ✨ Funcionalidades Implementadas

* **Autenticação e Proteção de Rotas:** Tela de login integrada ao JWT do Back-end com redirecionamento automático para usuários não autenticados.
* **Módulo de Clientes e Fornecedores:**
  * Listagem com filtro de busca instantânea por nome/razão social ou documento.
  * Máscaras dinâmicas para CPF, CNPJ e telefones (principal e secundário).
  * Preenchimento automático de endereço via **ViaCEP** com foco automático no campo de número.
  * Bloqueio de edição de documento (CPF/CNPJ) para manter a integridade cadastral.
  * Campo de **Observações Internas** com contador de caracteres em tempo real (limite de 500 caracteres).
* **Feedback Visual:** Tratamento e exibição amigável de mensagens de validação retornadas pela API.

---

## 🧭 Como Acessar os Módulos (Links Diretos)

No estágio atual do projeto, o **Painel Principal (`/dashboard`)** ainda não possui o menu lateral de navegação (previsto para as próximas Sprints). 

Após fazer o login, digite os endereços abaixo diretamente na barra do navegador para acessar as telas já concluídas:

* **Painel Principal:** `http://localhost:5173/dashboard`
* **Gestão de Clientes:** `http://localhost:5173/clientes`
* **Gestão de Fornecedores:** `http://localhost:5173/fornecedores`

---

## 🗺️ Roadmap (Próximas Sprints)

* [ ] **Menu de Navegação no Dashboard:** Criar sidebar/cards na tela `/dashboard` para acessar Clientes, Fornecedores e demais módulos sem precisar digitar a URL manualmente.
* [ ] **Painel de Usuários (Admin):** Tela administrativa para cadastro de novos colaboradores, definição de senhas iniciais, perfis de acesso e bloqueio de usuários inativos.
* [ ] **Catálogo de Produtos:** Interface de listagem, cadastro e edição de itens.
* [ ] **Painel de Estoque:** Dashboard com indicadores visuais de estoque baixo.
* [ ] **Upload de Planilhas:** Modal *Drag-and-Drop* para importação em lote (`.xlsx`/`.csv`) com relatório de erros.
* [ ] **Frente de Caixa / Pedidos:** Tela de emissão de pedidos de venda.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
* Node.js (v18+)
* A API (`erp-distribuidora-api`) deve estar em execução para o login e persistência de dados.

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Rogerio-Leal/erp-distribuidora-web.git](https://github.com/Rogerio-Leal/erp-distribuidora-web.git)
   cd erp-distribuidora-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a URL da API (opcional):**
   Caso utilize variáveis de ambiente, crie um arquivo `.env` na raiz do projeto apontando para o servidor local do Back-end:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

### 🔐 Acesso Padrão (Ambiente de Desenvolvimento)

Para testar a aplicação localmente, utilize as credenciais padrão do administrador inicial:

* **E-mail:** `admin@distribuidora.com`
* **Senha:** `123456`
