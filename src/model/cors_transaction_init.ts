import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity({
  name: 'cors_transactio_init',
})
export class CorsTransactionInitModel extends BaseModel {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  pk: string;

  @Column({
    name: 'to_address',
  })
  @Index()
  toAddress: string;

  @Column({
    name: 'from_address',
  })
  @Index()
  fromAddress: string;

  @Column({
    type: 'text',
    name: 'block_number',
  })
  blockNumber: string;

  @Column({
    name: 'block_hash',
  })
  blockHash: string;

  @Column({
    name: 'input_data',
    nullable: true,
  })
  inputData: string;

  @Column({
    name: 'init_over',
    default: false,
  })
  initOver: boolean;
}
