# Sistema de Gerenciamento de Estoque — Full Stack

Sistema **full stack** para gerenciamento de estoque, desenvolvido com foco em **boas práticas, arquitetura limpa, segurança e integração frontend/backend**.

O projeto simula um cenário real de aplicação, incluindo autenticação robusta, controle de acesso por permissões e ambiente facilmente replicável com Docker.

---

## Funcionalidades

- Autenticação completa (login e registro)
- Controle de acesso baseado em roles (**USER / ADMIN**)
- Gestão de produtos, categorias e estoque
- Dashboard com métricas e estatísticas
- Validação de dados no frontend e backend
- Autenticação stateless via JWT

---

## Tecnologias Utilizadas

### Backend (Java / Spring)
- Java
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- JPA / Hibernate
- Bean Validation (Jakarta Validation)
- BCrypt (criptografia de senhas)
- Lombok
- Maven

### Banco de Dados
- MySQL
- Docker (MySQL em container)
- Script de inicialização com criação automática do usuário **ADMIN**

### Frontend (React)
- React
- JavaScript
- React Router
- Custom Hooks (gerenciamento de autenticação)
- CSS moderno (variáveis e gradientes)
- Lucide React (ícones)

---

## Arquitetura

Frontend (React)
↓
REST API (Spring Boot)
↓
MySQL (Docker)


### Backend
- Arquitetura em camadas:
  - Controller
  - Service
  - Repository
- DTO Pattern para requests e responses
- API REST stateless
- CORS habilitado para comunicação cross-origin

### Frontend
- Consumo da API REST
- Gerenciamento de autenticação via token JWT
- Controle de rotas protegidas com base em permissões

---

## Autenticação e Segurança

A autenticação é baseada em **JWT (JSON Web Token)**:

1. Login gera um token JWT
2. O token é enviado no header `Authorization`
3. Rotas protegidas exigem token válido
4. Controle de acesso por roles (**USER / ADMIN**)

---

## Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose
- Java 17+
- Node.js
- Maven

### 1️⃣ Subir o banco de dados
```bash
docker-compose up -d
```
O container MySQL será iniciado automaticamente, incluindo o script de criação do usuário ADMIN.

### 2️⃣ Rodar o backend
```bash
mvn spring-boot:run
```
Ou pela classe principal
A API estará disponível em: http://localhost:8080

### 3️⃣ Rodar o frontend
npm install
npm run dev

Observações
Este projeto foi desenvolvido como parte do meu portfólio, com foco em:

organização de código
separação de responsabilidades
segurança
boas práticas no desenvolvimento full stack

