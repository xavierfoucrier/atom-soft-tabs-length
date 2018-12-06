'use babel';

import {CompositeDisposable, Directory} from 'atom';
const EditorConfig = require('editorconfig');

export default {

  // package configuration
  config: require('./config'),

  // editor body element
  body: document.querySelector('body'),

  // user defaults
  defaults: [],

  // package observer
  observer: null,

  // initializes the package
  activate() {

    // stores some user default settings
    this.defaults['showIndentGuide'] = atom.config.get('editor.showIndentGuide');

    // exits if the editor is using hard tab instead of soft tabs
    if (atom.config.get('editor.tabType') === 'hard' || !atom.config.get('editor.softTabs')) {
      return;
    }

    // inits the package observer
    this.observer = new CompositeDisposable();

    // observes package settings
    this.observe();

    // adds the package class to the body
    this.body.classList.add('atom-soft-tabs-length');
  },

  // disposes the package
  deactivate() {

    // restores the user default settings
    atom.config.set('editor.showIndentGuide', this.defaults['showIndentGuide']);

    // removes the class if the package is disabled
    this.body.classList.remove('atom-soft-tabs-length');

    // disposes the package observer
    this.observer.dispose();
  },

  // observes package settings
  observe() {

    // observes hideIndentGuide property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.hideIndentGuide', {}, (value) => {
      this.setIndentGuide(value);
    }));

    // observes softTabsLength property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.softTabsLength', {}, (value) => {
      this.setSoftTabsLength(value);
    }));
  },

  // sets the indent guide
  setIndentGuide(value) {
    if (value) {
      this.body.classList.add('no-guide');
    } else {
      this.body.classList.remove('no-guide');
    }
  },

  // sets the soft tabs length
  setSoftTabsLength(value) {

    // gets the soft tabs length depending on user settings
    let length = value;

    if (length === 'auto') {
      length = atom.config.get('editor.tabLength');
    }

    length = parseInt(length);


    // appends the soft tabs length setting
    this.body.setAttribute('data-soft-tabs-length', length);

    // observes text editors and search for an .editorconfig file
    this.observer.add(atom.workspace.observeTextEditors((editor) => {

      // exits if there is no path associated to the file
      if (typeof editor.getPath() === 'undefined') {
        return;
      }

      // gets the project path from the editor
      const projectPath = atom.project.relativizePath(editor.getPath())[0];

      // gets the editor config file
      const editorConfigFile = new Directory(projectPath).getFile('.editorconfig');

      // exits if the editor config file doesn't exists
      if (!editorConfigFile.existsSync()) {
        return;
      }

      // parses the .editorconfig file
      EditorConfig.parse(editorConfigFile.getPath()).then((properties) => {

        // exits if the .editorconfig file doesn't contain indent format
        if (!('indent_size' in properties) || !('indent_style' in properties)) {
          return;
        }

        // detects if the indent format differs from the editor configuration
        if (properties.indent_style === 'space' && properties.indent_size !== atom.config.get('editor.tabLength')) {

          // enables the editor indent guide
          atom.config.set('editor.showIndentGuide', true);

          // appends the soft tabs length setting
          this.body.setAttribute('data-soft-tabs-length', length);
        }
      });
    }));
  }
};
