// Question

import { ElementHandle } from 'puppeteer';

export type HTMLInputElementHandle = ElementHandle<HTMLInputElement>;
export type HTMLSelectElementHandle = ElementHandle<HTMLSelectElement>;

export enum FieldType {
  Text = 'INPUT',
  Select = 'SELECT',
  Radio = 'MAT-RADIO-GROUP',
}

export interface IFormField {
  element: ElementHandle;
  id: string;
  tagName: string;
  options: ReadonlyArray<ISelectOption | IRadioOption>;
}

export interface IFormFieldSelect extends IFormField {
  options: ReadonlyArray<ISelectOption>;
}

export interface IFormFieldRadio extends IFormField {
  options: ReadonlyArray<IRadioOption>;
}

export interface ISelectOption {
  element: ElementHandle<HTMLOptionElement>;
  value: string;
}

export interface IRadioOption {
  element: ElementHandle<HTMLInputElement>;
  value: string;
}
