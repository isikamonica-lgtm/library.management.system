import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new book
  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn,
        totalCopies: dto.totalCopies,
        availableCopies: dto.totalCopies,
        genreId: dto.genreId,
      },
      include: {
        genre: true,
      },
    });
  }

  // Retrieve all books with filtering, searching and pagination
  async findAll(
    genreId?: string,
    search?: string,
    page = '1',
    limit = '10',
  ) {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

    return this.prisma.book.findMany({
      where: {
        ...(genreId && { genreId: Number(genreId) }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        genre: true,
      },
    });
  }

  // Retrieve one book by ID
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  // Update an existing book
  async update(id: number, dto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: {
        genre: true,
      },
    });
  }

  // Delete a book
  async remove(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}