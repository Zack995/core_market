import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity({
  name: 'cors_balance',
})
export class CorsBalanceModel extends BaseModel {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  //transaction_hash
  pk: string;

  @Column({
    name: 'to_address',
  })
  @Index()
  userAddress: string;

  @Column({
    type: 'text',
    name: 'block_number',
  })
  userBalance: string;

  @Column({
    name: 'block_hash',
  })
  blockHash: string;

  // @Column({
  //     name: 'transaction_hash',
  // })
  // transactionHash: string;

  @Column({
    name: 'transaction_hash',
  })
  inputData: string;

  @Column({
    name: 'is_contract',
  })
  isContract: boolean;
}
