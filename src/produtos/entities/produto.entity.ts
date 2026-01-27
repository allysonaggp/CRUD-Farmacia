import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity('tb_produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 30, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column()
  quantidade: number;

  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  descricao: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.categoria)
  categoria: Categoria[];
}
