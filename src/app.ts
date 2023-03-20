import express from 'express';
import { Browser } from './browser/Browser.js';
import { Calculator } from './efc/Calculator.js';
import { Logger } from './browser/Logger.js';

const app = express();
const PORT = 8080;
const logger = new Logger();

app.get('/', async (_req, res) => {
  logger.start();
  const COLLEGEBOARD_EFC_URL = 'https://npc.collegeboard.org/app/efc/start';
  const browser = new Browser('College Board EFC Calculator');
  try {
    await browser.start();
    const page = await browser.newPage(COLLEGEBOARD_EFC_URL);
    const calculator = new Calculator(page);
    const efc = await calculator.calculate();
    res.json(efc);
  } catch (err: any) {
    console.error(err);
    res.status(400).send(`Womp. Something went wrong...${err}`);
  } finally {
    browser.close();
  }
});

app.listen(PORT || '8080', () => {
  console.log(`Running on PORT ${PORT}`);
});
