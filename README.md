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

## 10. Test the API
- This is a seeded user in DB during initilization.
```bash
curl --location 'http://localhost:3000/blog-platform-be/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{

  "email": "superuser@gmail.com",
  "password": "123456"
}'
```

## 11. Business Logic
- DB Schema: ![Screenshot](./assets/erdiagram.png)
- We have 2 roles seeded in roles table: Member and Super User.
- 1 user with role Super User is seeded in the DB with mail id superuser@gmail.com and password '123456'.
- Super User has additional features for deleting any Member, deleting posts of any Member, as per the requirements document.
- New Sign Up by default creates user with Member role, Super User can promote or demote the new user to and from Super User role respectively.
- Member has limited features like deleting only his own posts.
- Sign Up new users to create users with Member roles.
---
