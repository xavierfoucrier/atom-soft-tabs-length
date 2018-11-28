'use babel';

export default {

  // package configuration
  config: require('./config'),

  // editor body element
  body: document.querySelector('body'),

  // initializes the package
  activate() {

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
  }
};
