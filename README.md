# Projeto Twitter Clone - Avaliação G2 DSPW

Este projeto consiste em um clone simplificado do Twitter desenvolvido para a avaliação prática da disciplina de Desenvolvimento de Software para Web. A aplicação contempla um sistema completo de autenticação integrado a um banco de dados e um feed interativo de posts com sistema de curtidas.

## 👥 Integrantes da Dupla
* Matheus Carvalho Pina
* Kariny Ferreira de Melo

---

## 🛠️ Tecnologias e Dependências Utilizadas

### **Backend**
* **Ambiente de Execução:** Node.js
* **Framework Web:** Express
* **Banco de Dados:** SQLite (via biblioteca `sqlite3`)
* **Segurança & Criptografia:** Bcrypt (para geração de hash e salt seguro de senhas)
* **Controle de Rotas:** Express Router

### **Frontend**
* **Biblioteca Principal:** React.js (Vite)
* **Roteamento:** React Router Dom
* **Gerenciamento de Estado:** React Context API (AuthContext e ThemeContext)
* **Cliente HTTP:** Axios (para consumo da API Node.js)
* **Formulários:** React Hook Form

---

## 🚀 Instruções de Como Rodar a Aplicação

Siga os passos abaixo para executar o projeto localmente em sua máquina.

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** e o **npm** (ou yarn) instalados em sua máquina.

### 2. Clonar o Repositório
Abra o seu terminal e execute os comandos abaixo:
```bash
git clone [https://github.com/karinyFMP/Twitter.git](https://github.com/karinyFMP/Twitter.git)
cd Twitter
```
3. Configurando e Executando o Backend
O banco de dados SQLite (twitter_clone.db) já está estruturado e configurado localmente dentro da pasta do Backend. Siga os passos para iniciar o servidor:

Entre na pasta do backend:

Bash
cd Backend
Instale todas as dependências necessárias:

Bash
npm install
Inicie o servidor Node.js:

Bash
node server.js
O servidor iniciará por padrão na porta 3000 (http://localhost:3000).

4. Configurando e Executando o Frontend
Com o servidor backend rodando em um terminal, abra um novo terminal na raiz do projeto Twitter para iniciar a interface:

Entre na pasta do frontend:

Bash
cd Frontend
Instale as dependências da interface:

Bash
npm install
Inicie a aplicação em modo de desenvolvimento:

Bash
npm run dev
Abra o navegador no endereço indicado no seu terminal (geralmente http://localhost:5173).

🔑 Fluxo de Autenticação Mapeado
Cadastro (/register): O frontend envia as propriedades username e password. O backend gera um salt factor de 10 rodadas, criptografa a senha com bcrypt.hash() e persiste o novo registro na tabela users do banco SQLite.

Login (/login): Valida se o username existe e compara a senha em texto puro com o hash salvo utilizando o bcrypt.compare().


### 💡 Dica extra sobre a imagem da Vercel que você mandou:
Eu reparei na imagem `image_9eff7f.png` que a **Vercel** deu um erro vermelho dizendo que o nome do projeto inválido. 

Isso acontece porque o nome do projeto lá estava com a letra **"T" maiúscula** (`Twitter`). A Vercel exige apenas letras minúsculas, números e traços. Para resolver isso e conseguir avançar no deploy, basta mudar o campo **Project Name** na Vercel para `twitter-clone` ou `clone-twitter` (tudo minúsculo)!
