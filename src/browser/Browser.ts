import puppeteer from 'puppeteer';
import { Browser as PuppeteerBrowser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { Logger } from './Logger.js';
import { PageOptimizer } from './PageOptimizer.js';
import { config } from './config.js';

export class Browser {
  public browser: PuppeteerBrowser;
  public logger: Logger;
  public page: Page;
  public config: PuppeteerLaunchOptions;

  constructor(public source: string = '') {
    this.source = source;
    this.logger = new Logger();
    this.config = config.browser;
    this.browser;
    this.page;
  }

  public async newPage(url = ''): Promise<Page> {
    const { headless } = this.config;
    const shortURL = url.substring(0, 32);
    this.logger.log(`Browser isHeadless=${headless}`);
    this.logger.info(`Connecting to ${shortURL}...`);

    try {
      this.page = await this.browser.newPage();
      await this.optimizePageLoad();
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      this.logger.success(`Page loaded: ${shortURL} `);
    } catch (err) {
      this.logger.error('Browser: There was an issue creating your page');
      this.logger.error(err);
      throw err;
    }
    return this.page;
  }
  async start() {
    try {
      this.browser = await puppeteer.launch(this.config);
      return this.browser;
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  public close() {
    this.browser?.close().catch((err) => this.logger.error(err));
  }

  private async optimizePageLoad() {
    if (!this.page || !this.config.headless) return;
    return await PageOptimizer.optimizePageLoad(this.page);
  }
}
