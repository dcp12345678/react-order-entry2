import React from 'react';
import _ from 'lodash';

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

  static buildOptionsForSelectList(optionList, selectedOptionId) {
    const optId = parseInt(selectedOptionId, 10);
    const options = [];
    if (optId === -1) {
      options.push(<option value="-1" selected>--Please Select--</option>);
    } else {
      options.push(<option value="-1">--Please Select--</option>);
    }

    const optionsToAdd = _.map(optionList, (option) => {
      let o;
      if (option.id === optId) {
        o = (<option value={option.id} selected>{option.name}</option>);
      } else {
        o = (<option value={option.id}>{option.name}</option>);
      }
      return o;
    });
    options.push(...optionsToAdd);

    return options;
  }

}

export default Helper;