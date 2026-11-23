import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Seed Users (Librarian & Patron)
  await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {},
    create: {
      email: 'librarian@library.com',
      name: 'Grace Wanjiku',
      role: Role.LIBRARIAN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'patron@library.com' },
    update: {},
    create: {
      email: 'patron@library.com',
      name: 'David Kamau',
      role: Role.PATRON,
    },
  });

  // 2. Seed 4 Genres
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: {
      name: 'Fiction',
      description: 'Literary and contemporary novels',
    },
  });

  const sciFi = await prisma.genre.upsert({
    where: { name: 'Science Fiction' },
    update: {},
    create: {
      name: 'Science Fiction',
      description: 'Speculative fiction, space exploration, and future tech',
    },
  });

  const history = await prisma.genre.upsert({
    where: { name: 'History' },
    update: {},
    create: {
      name: 'History',
      description: 'World history, biographies, and historical analysis',
    },
  });

  const technology = await prisma.genre.upsert({
    where: { name: 'Technology' },
    update: {},
    create: {
      name: 'Technology',
      description: 'Software engineering, computer science, and system design',
    },
  });

  // 3. Seed 16 Books across the 4 Genres
  const books = [
    // Fiction (4)
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0385474542', publishedYear: 1958, totalCopies: 5, availableCopies: 5, genreId: fiction.id },
    { title: 'The River and the Source', author: 'Margaret A. Ogola', isbn: '978-9966882059', publishedYear: 1994, totalCopies: 4, availableCopies: 4, genreId: fiction.id },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '978-1400095209', publishedYear: 2006, totalCopies: 3, availableCopies: 3, genreId: fiction.id },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', publishedYear: 1960, totalCopies: 6, availableCopies: 6, genreId: fiction.id },

    // Science Fiction (4)
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', publishedYear: 1965, totalCopies: 4, availableCopies: 4, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569595', publishedYear: 1984, totalCopies: 3, availableCopies: 3, genreId: sciFi.id },
    { title: 'The Three-Body Problem', author: 'Cixin Liu', isbn: '978-0765382030', publishedYear: 2008, totalCopies: 5, availableCopies: 5, genreId: sciFi.id },
    { title: 'Project Hail Mary', author: 'Andy Weir', isbn: '978-0593135204', publishedYear: 2021, totalCopies: 4, availableCopies: 4, genreId: sciFi.id },

    // History (4)
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', publishedYear: 2011, totalCopies: 5, availableCopies: 5, genreId: history.id },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '978-0316548182', publishedYear: 1994, totalCopies: 3, availableCopies: 3, genreId: history.id },
    { title: 'The Guns of August', author: 'Barbara W. Tuchman', isbn: '978-0345476098', publishedYear: 1962, totalCopies: 2, availableCopies: 2, genreId: history.id },
    { title: 'Unbowed: A Memoir', author: 'Wangari Maathai', isbn: '978-0307275202', publishedYear: 2006, totalCopies: 4, availableCopies: 4, genreId: history.id },

    // Technology (4)
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', publishedYear: 2008, totalCopies: 6, availableCopies: 6, genreId: technology.id },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', publishedYear: 2017, totalCopies: 4, availableCopies: 4, genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '978-0135957059', publishedYear: 2019, totalCopies: 5, availableCopies: 5, genreId: technology.id },
    { title: 'Refactoring', author: 'Martin Fowler', isbn: '978-0134757599', publishedYear: 2018, totalCopies: 3, availableCopies: 3, genreId: technology.id },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  console.log('Seed completed: 4 genres and 16 books inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
