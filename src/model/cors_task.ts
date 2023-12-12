import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base';

@Entity({
  name: 'cors_tracker_task',
})
export class CorsTrackerTaskModel extends BaseModel {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  //blcok_hash
  pk: string;
  @Column({
    type: 'text',
    name: 'block_number',
  })
  blockNumber: string;

  @Column({
    name: 'size',
  })
  size: string;
}
