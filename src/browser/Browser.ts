import puppeteer, { PuppeteerErrors } from 'puppeteer';
import type { Browser as PuppeteerBrowser, Page } from 'puppeteer';
import { Logger } from './Logger.js';
import { PageOptimizer } from './PageOptimizer.js';
import { config, IConfig } from './config.js';

export class Browser {
  public browser: PuppeteerBrowser;
  public logger: Logger;
  public page: Page;
  private config: IConfig;

  constructor(public source: string = '') {
    this.source = source;
    this.logger = new Logger();
    this.config = config;
    this.browser;
    this.page;
  }

  async newPage(pageURL = ''): Promise<Page> {
    const { headless } = this.config.browser;
    try {
      this.page = await this.browser.newPage();
      const shortenedURL = pageURL.substring(0, 32);
      const messageStart = `Attempting to connect to ${shortenedURL}...`;
      const messageSuccess = `Page loaded: ${shortenedURL} `;

      this.logger.log(messageStart);
      await this.page.goto(pageURL, { waitUntil: 'domcontentloaded' });

      if (headless) await PageOptimizer.optimizePageLoad(this.page);
      this.logger.success(messageSuccess);
    } catch (err) {
      this.logger.error('Browser: There was an issue creating your page');
      this.logger.error(err);
      throw err;
    }
    return this.page;
  }
  async start() {
    try {
      this.browser = await puppeteer.launch(this.config.browser);
      return this.browser;
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  close() {
    this.browser?.close().catch((err) => this.logger.error(err));
  }
}
