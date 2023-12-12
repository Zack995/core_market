import { createConnection, getConnection, Repository, EntityTarget } from 'typeorm';
// import appConfig from "config";
import _ from 'lodash';
import * as models from '@/model';

let entities = [];
entities = entities.concat(_.values(models));

export async function connect() {
  // console.log('entities', entities);
  // const startTime = Date.now();
  const connection = await createConnection({
    entities: entities,
    type: 'postgres',
    url: 'postgres://core-market:123456@localhost:5432/core-market',
    synchronize: true,
  });
  return connection;
}
export function getRepository<Entity>(target: EntityTarget<Entity>): Repository<Entity> {
  const manager = getConnection().manager;
  return manager.getRepository(target);
}
