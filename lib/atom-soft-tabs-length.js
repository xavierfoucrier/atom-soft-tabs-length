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
  },

  // disposes the package
  deactivate() {
    //
  }
};
