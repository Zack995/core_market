import { CorsInitBalanceModel, CorsTransactionInitModel } from '@/model';
import { get } from '@/utils';
import { MoreThanOrEqual, getRepository } from 'typeorm';
// import Web3 from 'web3';
const corsTransactionInitModel = getRepository<CorsTransactionInitModel>(CorsTransactionInitModel);
const corsInitBalanceModel = getRepository<CorsInitBalanceModel>(CorsInitBalanceModel);

export class CorsBalanceInitService {
  async runInitBalance() {
    //1w笔来计算
    //- data:,{"p":"crc-20","op":"mint","tick":"cors","amt":"1000"}
    //0x646174613a2c7b2270223a226372632d3230222c226f70223a226d696e74222c227469636b223a22636f7273222c22616d74223a2231303030227d
    const input =
      '0x646174613a2c7b2270223a226372632d3230222c226f70223a226d696e74222c227469636b223a22636f7273222c22616d74223a2231303030227d';
    let startblock = '0';
    const res = await corsInitBalanceModel.query(`select sum(user_balance) as total from cors_init_balance`);
    let nowBalance = 0;
    if (res[0] && res[0]['total']) {
      nowBalance = res[0]['total'];
    }
    while (true) {
      const result = await corsTransactionInitModel.find({
        where: {
          blockNumber: MoreThanOrEqual(startblock), // 使用 MoreThan 表达式来获取大于指定值的记录
          initOver: false,
          inputData: input,
        },
        take: 10000,
      });
      if (!result || result.length < 1) {
        return;
      }
      for (let index = 0; index < result.length; index++) {
        const r = result[index];
        let balance = await corsInitBalanceModel.findOne({ where: { userAddress: r.fromAddress } });
        if (balance) {
          balance.userBalance = parseInt(balance.userBalance) + 1000 + '';
        } else {
          balance = new CorsInitBalanceModel();
          balance.userAddress = r.fromAddress;
          balance.userBalance = 1000 + '';
        }
        nowBalance = nowBalance + 1000;
        if (nowBalance > 21000000000) {
          console.log('balance max');
          return;
        }
        r.initOver = true;
        await corsInitBalanceModel.upsert(balance, ['userAddress']);
        await corsTransactionInitModel.upsert(r, ['pk']);
        startblock = result[result.length - 1].blockNumber;
      }
      console.log('total balance', nowBalance);
    }
  }
  async runInitTransaction() {
    // const web3 = new Web3(new Web3.providers.HttpProvider('https://1rpc.io/core'));
    let page = 1;
    let startblock = 0;
    let count = 0;
    while (true) {
      const offset = 100;
      const apiKey = 'd3df78c5e37b46d7a3b0866231ca9c82';
      const res = await get(
        `https://openapi.coredao.org/api?module=account&action=txlist&address=0x000000000000000000000000000000000000dEaD&startblock=${startblock}&endblock=9655524&page=${page}&offset=${offset}&sort=asc&apikey=${apiKey}`
      );
      if (!res || !res.result || res.result.length < 1) {
        return;
      }
      console.log('now run page', page);
      let nowBlock = 0;
      for (let i = 0; i < res.result.length; i++) {
        const tx = res.result[i];
        console.log('now run block number', tx.blockNumber, i, count++);
        const inputData = tx.input;
        // const code = await web3.eth.getCode(tx.from);
        const cors = new CorsTransactionInitModel();
        cors.pk = tx.hash;
        cors.toAddress = tx.to.toLowerCase();
        cors.fromAddress = tx.from.toLowerCase();
        cors.blockNumber = tx.blockNumber;
        cors.blockHash = tx.blockHash;
        cors.inputData = inputData;
        nowBlock = tx.blockNumber;
        // cors.isContract = code === '0x' ? false : true;
        await corsTransactionInitModel.upsert(cors, ['pk']);
      }
      page++;
      if (page > 10) {
        page = 1;
        startblock = nowBlock;
      }
    }
  }
}
