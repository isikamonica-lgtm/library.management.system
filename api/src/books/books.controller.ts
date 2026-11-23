import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Retrieve all books - Public
  @Get()
  findAll(
    @Query('genreId') genreId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.booksService.findAll(genreId, search, page, limit);
  }

  // Retrieve one book - Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  // Create a book - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  // Update a book - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.update(Number(id), dto);
  }

  // Delete a book - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(Number(id));
  }
}