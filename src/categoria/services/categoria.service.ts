import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../entities/categoria.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  // Metodo para mostrar todas as Cetegorias
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  // Metodo usado para Pesquisar por Id
  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id: id },
      relations: {
        produto: true,
      },
    });

    if (!categoria)
      throw new HttpException(
        'Categoria não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    return categoria;
  }

  // Metodo para Filtrar por Categoria
  async findByCategoria(categoria: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: { categoria: ILike(`%${categoria}%`) },
    });
  }

  // Metodo usado para criar uma Categoria
  async create(categoria: Categoria): Promise<Categoria> {
    const buscarCategoria = await this.findByCategoria(categoria.categoria);
    if (buscarCategoria)
      throw new HttpException('A Categoria já Existe', HttpStatus.BAD_REQUEST);
    return await this.categoriaRepository.save(categoria);
  }

  // Metodo usado para Alterar uma categoria
  async update(categoria: Categoria): Promise<Categoria> {
    await this.findById(categoria.id);
    return await this.categoriaRepository.save(categoria);
  }

  // Metodo usado para deletar uma categoria
  async delete(id: number): Promise<{ message: string; result: DeleteResult }> {
    await this.findById(id);
    const result = await this.categoriaRepository.delete(id);

    return {
      message: 'Categoria deletada com Sucesso!',
      result,
    };
  }
}
