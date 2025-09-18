# Blog Platform Backend - Setup Instructions

Follow these steps to set up the project locally:

## 1. Open a New Folder

## 2. Clone the Repository
```bash
git clone https://github.com/himanshu-0611/blog-platform-backend.git -b dev
```

## 3. Move to Root Directory
```bash
cd blog-platform-backend
```

## 4. Install Dependencies
```bash
npm install
```

## 5. Environment Setup
- Paste the `.env` file in the project root (sibling of `package.json`).
- Update PostgreSQL username, password, and other credentials if needed as per your local Postgres Server.

## 6. Generate Prisma Client
```bash
npx prisma generate
```

## 7. Run Migrations
```bash
npx prisma migrate dev
```

## 8. Seed Database
```bash
npm run seed
```

## 9. Start Development Server
```bash
npm run start:dev
```

## 10. Test API in Postman
- Example API endpoint:
```bash
{{localUrl}}/blog-platform-be/v1/auth/login
```

---

**Notes**
- Recommended: add a short note at the top specifying the required Node.js and npm versions (e.g., Node.js >= 18, npm >= 9).  
- If any command fails, check that your `.env` DB credentials and Postgres server are correct and running.
