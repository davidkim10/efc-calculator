import type { ElementHandle } from 'puppeteer';
import { IFormField, FieldType, IFormFieldRadio, IFormFieldSelect } from './types.js';

export class Question {
  public label: string = '';
  public formField: IFormField | IFormFieldRadio | IFormFieldSelect;

  constructor(public elementHandle: ElementHandle) {}

  public async init(): Promise<void> {
    this.label = await this.getLabel();
    this.formField = await this.getField();
  }

  private async getLabel(): Promise<string> {
    return await this.elementHandle.$eval('label', (label) => label.innerText);
  }

  private async getField() {
    const select = await this.elementHandle.$('select');
    const text = await this.elementHandle.$('input[type="text"]');
    const radio = await this.elementHandle.$('mat-radio-group');
    const targetEl = [select, text, radio].filter(Boolean)[0] as ElementHandle;
    const field = await targetEl.evaluate(({ id, tagName }) => ({
      id,
      tagName,
    }));
    let options = [];

    switch (field.tagName) {
      case FieldType.Select:
        const selectOptions = await this.getFieldOptions(targetEl, 'option');
        options = selectOptions;
        break;

      case FieldType.Radio:
        const radioOptions = await this.getFieldOptions(targetEl, 'input[type="radio"]');
        options = radioOptions;
        break;
    }

    return { ...field, element: targetEl, options };
  }

  private async getFieldOptions(
    elementHandler: ElementHandle,
    selector: string
  ): Promise<any> {
    const options = [];
    const fieldOptions = await elementHandler.$$(selector);
    for (const option of fieldOptions) {
      const valueHandle = await option.getProperty('value');
      const value = (await valueHandle.jsonValue()) as string;
      options.push({ element: option, value });
    }
    return options;
  }
}
