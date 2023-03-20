import clc from 'cli-color';
const error = clc.red;
const info = clc.cyanBright;
const notice = clc.yellowBright;
const success = clc.green;

interface ILogMessage {
  date: number | Date;
  seen: string;
  type: string;
  log: any;
}

export class Logger {
  public logs: ILogMessage[];
  constructor() {
    this.logs = [];
  }

  info(..._args: unknown[]) {
    console.log(info(...arguments));
  }

  log(..._args: unknown[]) {
    console.log(...arguments);
  }

  error(..._args: unknown[]) {
    console.log(error(...arguments));
  }

  scrape(message: any) {
    const log = notice('[SCRAPE]') + ` ${message}`;
    this.log(log, message, 'scrape');
  }

  start() {
    const message = '• RUNNING SCRAPER •';
    const intro = `....\n ${message} \n....\n`;
    const style = { '.': notice('-----') };
    console.log(clc.art(intro, style), message, 'start');
  }

  success(message: string) {
    const log = success('[SUCCESS]') + ` ${message}`;
    console.log(log);
  }
}
