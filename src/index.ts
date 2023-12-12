import { connect } from "./utils/db";


async function main() {
  await connect();

  require("./server/index");

}
main();

