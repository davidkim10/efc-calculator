import type { ElementHandle, Page } from 'puppeteer';
import { Question } from './Question.js';

export class Section {
  public questions: Set<Question>;
  private questionsSelector: string;

  constructor(public page: Page) {
    this.questions = new Set();
    this.questionsSelector = 'app-question';
  }

  public async getQuestions() {
    await this.page.waitForNetworkIdle();
    await this.page.waitForSelector(this.questionsSelector);
    const questions = await this.page.$$(this.questionsSelector);

    for (const question of questions) {
      await this.createQuestion(question);
    }
  }

  private async createQuestion(questionElHandle: ElementHandle) {
    const question = new Question(questionElHandle);
    await question.init();
    this.questions.add(question);
  }
}