import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  // Retrieve all genres - Public
  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  // Retrieve one genre - Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(Number(id));
  }

  // Create a genre - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Post()
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  // Update a genre - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.genresService.update(Number(id), dto);
  }

  // Delete a genre - LIBRARIAN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(Number(id));
  }
}