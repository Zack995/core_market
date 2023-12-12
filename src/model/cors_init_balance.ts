import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity({
  name: 'cors_init_balance',
})
export class CorsInitBalanceModel extends BaseModel {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    name: 'user_address',
  })
  userAddress: string;

  @Column({
    type: 'numeric',
    name: 'user_balance',
  })
  userBalance: string;
}
