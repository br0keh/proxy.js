const proxyjs = require("./proxy");

async function main() {
  let Proxy = await proxyjs.GetRandom("<ip>:<port>");

  console.log(Proxy);
  // 127.0.0.1:80
}

main();
