# FullstackProject

Sistema fullstack em construção para gerenciamento de estoque, permitindo controle de produtos, categorias e movimentações, com autenticação segura via JWT.

### Backend
- **Java**
- **Spring Boot**
- **Spring Security**
- **JWT (JSON Web Token)** para autenticação
- **Lombok** para reduzir boilerplate
- **MySQL**
- **Docker** (MySQL em container)
- **Maven**

### Frontend
- **React.js**
- **JavaScript**
- **Tailwind CSS**

### Arquitetura

frontend (React)
↓ REST API
backend (Spring Boot)
↓
MySQL (Docker)

- Frontend consome a API REST
- Backend valida autenticação com JWT
- Banco roda isolado em container Docker

## Autenticação

A segurança é feita utilizando **JWT**:
- Login gera um token
- Token é enviado no header `Authorization`
- Rotas protegidas exigem token válido


# Como Rodar o projeto 
## Subir o banco
docker-compose up -d

## Rodar o backend
```bash
./mvnw spring-boot:run
```
 - Ou rodar manualmente o arquivo principal

**A API ficará disponível em http://localhost:8080**

## Rodar o frontend
```bash
npm install
npm run dev
```
