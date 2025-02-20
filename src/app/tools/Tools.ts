export class Tools {
  static getCountryFlagLinkByIso2(iso2?: string): string {
    if (!iso2) {
      return '';
    }

    return `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${iso2.toLowerCase()}.svg`;
  }
}
