import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categories')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // INICIO DE CRUD BÁSICO
  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Post('/deleteManyCategories')
  removeManyUsers(@Body() idsCategories: number[]) {
    return this.categoriasService.removeMany(idsCategories);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }
  // FIN DE CRUD BÁSICO

  @Get('getAllByLevel/:idNivel')
  findAllByLevel(@Param('idNivel') idNivel: number) {
    return this.categoriasService.findAllByLevel(+idNivel)
  }
}
