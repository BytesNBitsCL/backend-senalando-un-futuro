import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PalabrasService } from './palabras.service';
import { CreatePalabraDto } from './dto/create-palabra.dto';
import { UpdatePalabraDto } from './dto/update-palabra.dto';

@Controller('words')
export class PalabrasController {
  constructor(private readonly palabrasService: PalabrasService) {}

  @Post()
  create(@Body() createPalabraDto: CreatePalabraDto) {
    return this.palabrasService.create(createPalabraDto);
  }

  @Post('/deleteManyWords')
  removeManyUsers(@Body() idsWords: number[]) {
    return this.palabrasService.removeMany(idsWords);
  }

  @Get()
  findAll() {
    return this.palabrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palabrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePalabraDto: UpdatePalabraDto) {
    return this.palabrasService.update(+id, updatePalabraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.palabrasService.remove(+id);
  }

  @Get('getAllByCategory/:idCategoria')
  findAllByCategory(@Param('idCategoria') idCategoria: number) {
    return this.palabrasService.findAllByCategory(+idCategoria)
  }

  @Get('getAllWordsFromLevel/:idNivel')
  findAllByLevel(@Param('idNivel') idNivel: number) {
    return this.palabrasService.findAllByLevel(+idNivel)
  }
}
