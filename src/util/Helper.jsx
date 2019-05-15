class Helper {

  static isNullOrWhitespace(input) {
    return !input || input.trim().length < 1;
  }

  static setSessionStorageObject(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getSessionStorageObject(key) {
    const value = sessionStorage.getItem(key);
    return value && JSON.parse(value);
  }

  static formatDate(date) {
    const d = new Date(date);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = d.getFullYear();

    if (month.length < 2) { // eslint-disable-line no-magic-numbers
      month = `0${month}`;
    }
    if (day.length < 2) { // eslint-disable-line no-magic-numbers
      day = `0${day}`;
    }

    return [year, month, day].join('-');
  }

}

export default Helper;