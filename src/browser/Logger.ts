import clc from 'cli-color';
const error = clc.red;
const info = clc.cyanBright;
const notice = clc.yellowBright;
const success = clc.green;

// TODO: Swap out logger to third party package

export class Logger {
  constructor() {}

  info(..._args: unknown[]) {
    console.log(info(...arguments));
  }

  log(..._args: unknown[]) {
    console.log(...arguments);
  }

  error(..._args: unknown[]) {
    console.log(error(...arguments));
  }

  start() {
    const message = '• RUNNING EFC CALCULATOR •';
    const intro = `....\n ${message} \n....\n`;
    const style = { '.': notice('-----------') };
    console.log(clc.art(intro, style));
  }

  success(..._args: unknown[]) {
    console.log(success('[SUCCESS]'), ...arguments);
  }
}
