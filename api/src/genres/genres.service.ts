import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new genre
  async create(dto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { name: dto.name },
    });

    if (existingGenre) {
      throw new ConflictException('This genre already exists');
    }

    return this.prisma.genre.create({
      data: dto,
    });
  }

  // Retrieve all genres
  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  // Retrieve one genre by ID
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // Update a genre
  async update(id: number, dto: UpdateGenreDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    if (dto.name && dto.name !== genre.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name: dto.name },
      });

      if (existingGenre) {
        throw new ConflictException('This genre already exists');
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: dto,
    });
  }

  // Delete a genre
  async remove(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}