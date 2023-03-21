import { Page } from 'puppeteer';

export class SectionNav {
  public readonly stepMap: Readonly<Record<string, string>>;
  private _isLastStep: boolean;
  private _pathName: string;

  constructor(protected page: Page) {
    this.stepMap = {
      step1: '/app/efc/start',
      step2: '/app/efc/dependency',
      step3: '/app/efc/household-information',
      step4: '/app/efc/parent-income',
      step5: '/app/efc/parent-assets',
      step6: '/app/efc/student-finances',
    };
    this._isLastStep = false;
    this._pathName = this.stepMap['step1'];
    this.handleOnFrameNavigated();
  }

  public get isLastStep(): boolean {
    return this._isLastStep;
  }

  public get pathName(): string {
    return this._pathName;
  }

  public async next(): Promise<void> {
    const selector = 'button[type="submit"]';
    await this.page.waitForSelector(selector);
    const nextButton = await this.page.$(selector);
    await nextButton?.click();
  }

  private async checkLastStep(): Promise<boolean> {
    await this.page.waitForSelector('a.nav-link');
    return await this.page.$$eval('a.nav-link', (links) => {
      const isLastIndex = links.length - 1;
      const activeLink = links.filter((link) => link.classList.contains('active'))[0];
      return links.indexOf(activeLink) === isLastIndex;
    });
  }

  private handleOnFrameNavigated(): void {
    this.page.on('framenavigated', async (frame) => {
      const hostName = 'https://npc.collegeboard.org';
      this._pathName = frame.url().split(hostName)[1];
      this._isLastStep = await this.checkLastStep();
    });
  }
}
