# core_market

## core dao 铭文市场

- 提前安装好 pgsql postgres://core-market:123456@localhost:5432/core-market
- 配置好 scan api key
- https://scan.coredao.org/my/api_key
- 运行成功后 访问 初始化所有交易
- http://127.0.0.1:8000/init_Transaction
- 交易初始化完成后 进行余额初始化
- http://127.0.0.1:8000/init_Balance

### 本地开发

```bash
$ npm install
$ npm run dev
$ open http://localhost:8000/
```

### 部署

```bash
$ yarn start
$ yarn stop
```

### 内置指令

- 使用 `yarn run lint` 来做代码风格检查。
- 使用 `yarn test` 来执行单元测试。
- 使用 `yarn commit` 替代`git commit

### core mint data

- 铸造代码：
- data:,{"p":"crc-20","op":"mint","tick":"cors","amt":"1000"}
- 16 进制代码：0x646174613a2c7b2270223a226372632d3230222c226f70223a226d696e74222c227469636b223a22636f7273222c22616d74223a2231303030227d
- 转账给 dead 销毁地址：
- 0x000000000000000000000000000000000000dEaD
