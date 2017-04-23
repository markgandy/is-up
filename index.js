const request = require("request-promise");
const rx = require("rxjs");
const TelegramBot = require("node-telegram-bot-api");
const { urls, pingInterval, healthCheckInterval } = require("./config");
const { startServer } = require("./server");

const swrTelegramToken = process.env.SWR_TELEGRAM_TOKEN;
const swrBot = new TelegramBot(swrTelegramToken, { polling: true });
const chatId = "101667313"; // My personal chatId that alerts will be sent to

const pingWebsite = async url => {
  console.log(`Pinging ${url}`);
  const options = { url, resolveWithFullResponse: true };
  try {
    const response = await request(options);
    if (!response || !response.statusCode || response.statusCode !== 200) {
      throw new Error("Non 200 response");
    }
    console.log(response.statusCode);
  } catch (err) {
    swrBot.sendMessage(
      chatId,
      `🔥🔥 Oh no!! It looks like ${url} is down 🔥🔥`
    );
    console.log(err);
  }
};

const pingWebsites = async urls => {
  await Promise.all(urls.map(pingWebsite));
};

const sendHealthyMessage = () => {
  swrBot.sendMessage(chatId, "🆗");
};

rx.Observable.interval(pingInterval * 1000).subscribe(() => pingWebsites(urls));
rx.Observable
  .interval(healthCheckInterval * 1000)
  .subscribe(sendHealthyMessage);
startServer(); // A server is required for running on Now.sh
