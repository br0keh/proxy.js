const proxyjs = require("./proxy");
const axios = require("axios");
async function main() {
  let proxy = await proxyjs.GetRandom();
  console.log(proxy);
  // { ip: '127.0.0.1', port: '8080' }

  // example proxy usage
  let Request = await axios({
    url: "https://google.com/",
    method: "get",
    headers: { "user-agent": "Mozilla" },
    proxy: {
      host: proxy.ip,
      port: proxy.port
    }
  });

  console.log(Request.data);
  // request body
}

main();
