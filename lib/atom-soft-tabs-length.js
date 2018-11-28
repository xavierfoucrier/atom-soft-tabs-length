'use babel';

export default {

  // package configuration
  config: require('./config'),

  // editor body element
  body: document.querySelector('body'),

  // initializes the package
  activate() {

    // observes package settings
    this.observe();

    // exits if the soft tabs setting is disabled
    if (!atom.config.get('editor.softTabs')) {
      return;
    }

    // adds the class package to the body
    this.body.classList.add('atom-soft-tabs-length');
  },

  // disposes the package
  deactivate() {

    // removes the class if the package is disabled
    this.body.classList.remove('atom-soft-tabs-length');
  },

  // observes package settings
  observe() {

    // observes hideIndentGuide property
    atom.config.observe('atom-soft-tabs-length.hideIndentGuide', {}, (value) => {
      this.toggleIndentGuide(value);
    });
  },

  // toggles the indent guide
  toggleIndentGuide(value) {
    if (value) {
      this.body.classList.add('no-guide');
    } else {
      this.body.classList.remove('no-guide');
    }
  }
};
