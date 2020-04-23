declare module "*.svg";
declare module "*.png";

declare namespace Intl {
  class ListFormat {
    constructor(locale: string);

    format(listOfStrings: string[]): string;
  }

  // const ListFormat: any; // Use this instead of the class if you don't want to declare all properties/methods
}
