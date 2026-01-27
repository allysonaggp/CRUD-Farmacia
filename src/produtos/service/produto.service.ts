import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { ILike, Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  // Metodo para mostrar todos os produtos
  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }

  // Metodo para pesquisar por Id
  async findById(id: number): Promise<Produto> {
    const categoria = await this.produtoRepository.findOne({
      where: { id: id },
    });
    if (!categoria)
      throw new HttpException('Produto não encontrado!', HttpStatus.OK);
    return categoria;
  }

  // Metodo usado para filtrar por Nome
  async FindByName(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: { nome: ILike(`%${nome}%`) },
    });
  }

  // Metodo usado para criar um produto
  async create(produto: Produto): Promise<Produto> {
    const buscarProduto = await this.FindByName(produto.nome);
    if (buscarProduto)
      throw new HttpException('O Produto já existe!', HttpStatus.BAD_REQUEST);
    return await this.produtoRepository.save(produto);
  }

  // Metodo usado para Alterar um Produto
  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);
    return this.produtoRepository.save(produto);
  }

  // Metodo usado para deletar um Produto
  async delete(id: number): Promise<{ message: string; result: DeleteResult }> {
    await this.findById(id);
    const result = await this.produtoRepository.delete(id);
    return {
      message: 'Produto deletado com Sucesso!',
      result,
    };
  }
}
