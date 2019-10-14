const axios = require("axios");
const htmlparser = require("node-html-parser");

const State = {
  list: [],
  requests: []
};

const ProxySites = [
  "https://sslproxies.org/",
  "https://free-proxy-list.net/",
  "https://free-proxy-list.net/anonymous-proxy.html"
];

async function FetchBody(ProxySite) {
  let psRequest = await axios({
    url: ProxySite,
    headers: {
      "user-agent": "Mozilla"
    },
    method: "GET"
  }).catch(() => {
    throw new Error(`Error in '${ProxySite}' request.`);
  });

  let psBody = psRequest.data;

  State.requests.push({
    site: ProxySite,
    status: psRequest.status
  });

  return psBody;
}

function ValidateProxyHost(ProxyHost = String) {
  if (
    !ProxyHost.match("([0-9]+).([0-9]+).([0-9]+).([0-9]+)") ||
    ProxyHost.length <= 10
  ) {
    return false;
  }
  return true;
}

const ScrapeProxies = async () => {
  let ParsedProxies = [];
  return await Promise.all(
    ProxySites.map(async site => {
      let Body = await FetchBody(site);
      let Parsed = htmlparser.parse(Body);
      let ProxyList = Parsed.querySelectorAll("tr");

      for (
        let ProxyIndex = 0;
        ProxyIndex < Object.keys(ProxyList).length;
        ProxyIndex++
      ) {
        const element = ProxyList[ProxyIndex];
        try {
          let ProxyHost = String(element.childNodes[0].childNodes[0].rawText);
          let ProxyPort = element.childNodes[1].childNodes[0].rawText;
          let ProxyCountry = element.childNodes[2].childNodes[0].rawText;

          if (
            ProxyHost &&
            ProxyPort &&
            ProxyCountry &&
            ValidateProxyHost(ProxyHost) === true
          )
            ParsedProxies.push(`${ProxyHost}:${ProxyPort}`);
        } catch (error) {}
      }

      State.list = ParsedProxies;
    })
  );
};

async function GetRandomProxy() {
  // RETURN_MASK EXAMPLES = <ip>:<port>, IP:<ip>|PORT:<port>

  let RandomProxy = "";

  if (Object.keys(State.list).length <= 0) {
    await ScrapeProxies(ProxySites).then(() => {
      RandomProxy =
        State.list[Math.floor(Math.random() * Object.keys(State.list).length)];
      let ip = RandomProxy.split(":")[0];
      let port = RandomProxy.split(":")[1];

      return { ip, port };
    });
  }
  RandomProxy =
    State.list[Math.floor(Math.random() * Object.keys(State.list).length)];
  let ip = RandomProxy.split(":")[0];
  let port = RandomProxy.split(":")[1];

  return { ip, port };
}

module.exports.GetRandom = GetRandomProxy;
module.exports.State = State;
module.exports.Scrape = ScrapeProxies;
