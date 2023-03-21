import type { ElementHandle } from 'puppeteer';
import { FieldType, IFormField, IRadioOption, ISelectOption } from './types.js';

export class Question {
  public label: string = '';
  public formField: IFormField;

  constructor(public elementHandle: ElementHandle) {}

  public async init(): Promise<void> {
    this.label = await this.getLabel();
    this.formField = await this.getField();
  }

  private async getLabel(): Promise<string> {
    return await this.elementHandle.$eval('label', (label) => label.innerText);
  }

  private async getField(): Promise<IFormField> {
    const select = await this.elementHandle.$('select');
    const text = await this.elementHandle.$('input[type="text"]');
    const radio = await this.elementHandle.$('mat-radio-group');
    const fieldElement = [select, text, radio].filter(Boolean)[0] as ElementHandle;
    const { id, tagName } = await fieldElement.evaluate(this.getElementAttributes);
    let options: ReadonlyArray<ISelectOption | IRadioOption> = [];

    switch (tagName) {
      case FieldType.Select:
        options = await this.getFieldOptions(fieldElement, 'option');
        break;

      case FieldType.Radio:
        options = await this.getFieldOptions(fieldElement, 'input[type="radio"]');
        break;
    }

    return { id, tagName, element: fieldElement, options };
  }

  private async getFieldOptions(
    field: ElementHandle,
    selector: 'option' | 'input[type="radio"]'
  ): Promise<any> {
    const options = [];
    const elements = await field.$$(selector);
    for (const element of elements) {
      const value = await element.evaluate((el) => el.value);
      options.push({ element, value });
    }
    return options;
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const { tagName, attributes } = element;
    const attrs: Record<string, string> = { tagName };
    for (const { name, value } of attributes) {
      attrs[name] = value;
    }
    return attrs;
  }
}
