import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity({
  name: 'cors_transactio',
})
export class CorsTransactionModel extends BaseModel {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  //transaction_hash
  pk: string;

  @Column({
    name: 'from_address',
  })
  @Index()
  fromAddress: string;

  @Column({
    name: 'to_address',
  })
  @Index()
  toAddress: string;

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
  })
  inputData: string;

  @Column({
    name: 'op',
  })
  op: string;

  @Column({
    name: 'tick',
  })
  tick: string;

  @Column({
    name: 'amt',
  })
  amt: string;

  @Column({
    name: 'p',
  })
  p: string;
}
