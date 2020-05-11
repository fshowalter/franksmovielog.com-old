/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

declare module "*.svg";
declare module "*.png";
declare module "*.jpg";

declare namespace Intl {
  declare class ListFormat {
    constructor(locale: string);

    format(listOfStrings: string[]): string;
  }

  // const ListFormat: any; // Use this instead of the class if you don't want to declare all properties/methods
}

declare module "remarkable";

declare namespace remarkable {
  declare class Remarkable {
    render(markdown: string): string;
  }
}
