'use babel';

import {CompositeDisposable} from 'atom';

export default {

  // package configuration
  config: require('./config'),

  // editor body element
  body: document.querySelector('body'),

  // package observer
  observer: null,

  // initializes the package
  activate() {

    // observes package settings
    this.observe();

    // exits if the editor is using hard tab instead of soft tabs
    if (!atom.config.get('editor.softTabs')) {
      return;
    }

    // adds the package class to the body
    this.body.classList.add('atom-soft-tabs-length');
  },

  // disposes the package
  deactivate() {

    // removes the class if the package is disabled
    this.body.classList.remove('atom-soft-tabs-length');

    // disposes the package observer
    this.observer.dispose();
  },

  // observes package settings
  observe() {

    // inits the package observer
    this.observer = new CompositeDisposable();

    // observes hideIndentGuide property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.hideIndentGuide', {}, (value) => {
      this.toggleIndentGuide(value);
    }));
  },

  // toggles the indent guide
  toggleIndentGuide(value) {
    if (value) {
      this.body.classList.add('no-guide');
    } else {
      this.body.classList.remove('no-guide');
    }
  },

  // gets the soft tabs length depending on the user settings
  getSoftTabsLength() {
    const length = atom.config.get('atom-soft-tabs-length.softTabsLength');

    if (length === 'auto') {
      return atom.config.get('editor.tabLength');
    }

    return parseInt(length);
  }
};
