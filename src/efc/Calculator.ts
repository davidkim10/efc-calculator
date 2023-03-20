import { Page } from 'puppeteer';
import { SectionNav } from './SectionNav.js';
import { Section } from './Section.js';
import { FieldType } from './types.js';

export class Calculator extends SectionNav {
  public sections: Map<string, Section>;

  constructor(protected page: Page) {
    super(page);
    this.sections = new Map();
  }

  public get steps() {
    return Object.keys(this.stepMap);
  }

  public async calculate() {
    for (let i = 0; i < this.steps.length; i++) {
      const stepKey = this.steps[i];
      const section = new Section(this.page);
      await section.getQuestions();
      this.sections.set(stepKey, section);

      console.table({
        i,
        stepKey,
        path: this.pathName,
        isLast: this.isLastStep,
        questions: section.questions.size,
      });

      await this.testAutoFill(section);

      // To Do: Check to make sure page actually navigated.
      // Currently im just hitting "next" and not checking for errors
      // Assuming that the page has no errors :/
      // This will fail for dynamic fields that populate after a selection is made
      await this.next();

      if (this.isLastStep) {
        const efc = await this.getEFC();
        console.log(JSON.stringify(efc));
        return efc;
      }
    }
  }

  private async getEFC() {
    // Testing purposes only
    await this.page.waitForSelector('.result-cards');
    return await this.page.$$eval('.result-cards', (cards) => {
      return cards.map((card) => {
        const data: { type: string; contributions: any[] } = {
          type: '',
          contributions: [],
        };
        data.type = card?.querySelector('h2')?.textContent ?? '';

        card.querySelectorAll('p').forEach((p) => {
          const heading = p.childNodes[0].textContent ?? '';
          const dollarValue = p.childNodes[2].textContent ?? '';
          data.contributions.push({ key: heading, value: dollarValue });
        });

        return data;
      });
    });
  }

  private async testAutoFill(section: Section) {
    // Testing purposes only
    // Just fill out the first option for each question or "123" for text inputs
    for (const q of section.questions) {
      // Todo: Need to fix this issue and remove the timeout
      await this.page.waitForTimeout(1000);
      switch (q.formField.tagName) {
        case FieldType.Select:
          await q.formField.element.select(q.formField?.options?.[1]?.value ?? '');
          break;
        case FieldType.Text:
          await q.formField.element.type('123');
          await this.page.waitForNetworkIdle();
          break;
        case FieldType.Radio:
          await q.formField.options?.[1]?.element?.click();
          break;
      }
    }
  }
}
