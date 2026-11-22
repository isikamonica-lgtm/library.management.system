Library Management System

About the Project

This project is a backend data layer for a Library Management System. It is built using NestJS, Prisma ORM, and PostgreSQL. The database is designed to organize information about library members, books, genres, and reviews.

Technologies Used

- Node.js – Runs the application.
- NestJS – Provides the backend framework.
- Prisma ORM – Defines database models and handles database operations.
- PostgreSQL – Stores the application's data.
- Supabase – Hosts the PostgreSQL database.

Database Design

The database is made up of five main models and one enum:

- User: Holds member details such as name, email, and assigned role.
- Role: Defines the available user roles: "PATRON" and "LIBRARIAN".
- Genre: Keeps the names and descriptions of book categories.
- Book: Contains book details, including title, author, ISBN, publication year, and available copies.
- Review: Records ratings and comments submitted by users about books.

Schema Decisions

Why I Used a Separate Genre Model

I decided to keep genres in their own table and connect them to books using "genreId". This means a book stores a reference to its genre instead of repeating the genre's name and description.

For example, several books can belong to the Fiction genre without each book having to store the same genre information.

I chose this approach for a few reasons:

1. Less duplication: Each genre is stored once and can be linked to many books.
2. Easier updates: If I change a genre's description, I only need to update it in one place.
3. Reliable relationships: The foreign key makes sure that a book is connected to an existing genre.
4. Simpler data retrieval: Prisma can fetch a book together with its associated genre.
5. Room for growth: New genres can be added without changing the structure of existing book records.

The relationship is one-to-many: one genre can have several books, while each book is linked to one genre.

Relational Databases and Document Databases

For this project, I used PostgreSQL with Prisma because the information has clear relationships. Books belong to genres, and reviews are connected to both books and users.

In a document database, related information can instead be stored together inside flexible documents. That approach can be useful when information varies significantly or is usually accessed as one complete document.

I preferred a relational database here because keeping related records connected and consistent is important for managing library information.

Database Seeding

I created a seed file at "api/prisma/seed.ts" to add sample information to the database.

The seed file contains:

- 4 genres: Technology, Fiction, History, and Science.
- 15 books shared across those genres.

I used Prisma's "upsert()" operation when inserting records. This helps prevent duplicate entries when the seed script is executed more than once.

Setting Up the Project

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the API directory

cd library-management-system/api

3. Install the dependencies

npm install

4. Set up environment variables

Create a ".env" file in the API directory using ".env.example" as a guide.

Add the required PostgreSQL connection variables:

- "DATABASE_URL"
- "DIRECT_URL"

Use your own database connection details. Keep your actual credentials private and do not commit ".env" to GitHub.

5. Generate the Prisma Client

npx prisma generate --config prisma7.config.ts

6. Apply database migrations

npx prisma migrate dev --config prisma7.config.ts

7. Add the sample records

npx prisma db seed --config prisma7.config.ts

Project Structure

library-management-system/
├── README.md
└── api/
├── prisma/
│ ├── migrations/
│ ├── schema.prisma
│ └── seed.ts
├── src/
│ ├── prisma/
│ │ ├── prisma.module.ts
│ │ └── prisma.service.ts
│ └── generated/
├── .env
├── .env.example
└── prisma7.config.ts

Current Progress

- [x] Designed the database schema.
- [x] Connected PostgreSQL through Supabase.
- [x] Created and applied the initial migration.
- [x] Added four genres to the database.
- [x] Added fifteen sample books.
- [x] Included the Review model as an additional relationship.
- [x] Prepared the Prisma configuration and seed script.
      Schema Decisions Why `Book` References `Genre` Instead of Embedding It
      In our PostgreSQL schema, `Book` stores a foreign key (`genreId`) referencing the `Genre` table via `@relation` rather than embedding the genre name as a raw text field on every book record:

1.Data Consistency & Normalization:** Storing genres in a dedicated table prevents spelling variations or duplicates (e.g., `"Sci-Fi"` vs. `"Science Fiction"`).
2.Single-Place Updates:** Renaming a genre or updating its description requires updating only one row in `Genre` instead of modifying hundreds of `Book` rows.
3.Referential Integrity:** PostgreSQL enforces that every `genreId` on a `Book` points to an existing `Genre`, preventing orphaned or invalid categories.
4.Efficient Filtering & Metadata:** The catalog can easily query all available genres for filter dropdowns or attach extra fields (such as genre descriptions) without bloating the `Book` table.
Relational Modeling vs. Document Databases (Reflection)
Unlike a document database (such as MongoDB) where related data like genres or reviews are often denormalized and embedded directly inside a single document, modeling in Prisma with PostgreSQL requires defining strict schemas, explicit foreign keys (`genreId`, `bookId`, `userId`), and upfront migrations before inserting data. While this adds an extra migration step when changing fields, it guarantees type safety across NestJS and prevents inconsistent data shapes.
