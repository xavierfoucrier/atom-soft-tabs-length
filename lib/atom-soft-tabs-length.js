'use babel';

import { CompositeDisposable, Directory, File } from 'atom';
const EditorConfig = require('editorconfig');
const PackageDependencies = require('atom-package-deps');

export default {

  // package configuration
  config: require('./config'),

  // editor body element
  body: document.querySelector('body'),

  // soft tabs length
  length: null,

  // user defaults
  defaults: [],

  // scope manager
  scopes: [],

  // package observer
  observer: null,

  // initialize the package
  activate() {

    // check if all required dependencies are installed
    PackageDependencies.install('atom-soft-tabs-length', false).then(() => {

      // store some user default settings
      this.defaults['showIndentGuide'] = atom.config.get('editor.showIndentGuide');

      // exit if the editor is using hard tab instead of soft tabs
      if (atom.config.get('editor.tabType') === 'hard' || !atom.config.get('editor.softTabs')) {
        return;
      }

      // init the package observer
      this.observer = new CompositeDisposable();

      // observe package settings
      this.observe();

      // add the package class to the body
      this.body.classList.add('atom-soft-tabs-length');

      // define invisible space character on the body element (this will be used to display virtual spaces)
      this.body.setAttribute('data-soft-tabs-invisible-space', atom.config.get('editor.invisibles.space'));
    });
  },

  // dispose the package
  deactivate() {

    // restore the user default settings
    atom.config.set('editor.showIndentGuide', this.defaults['showIndentGuide']);

    // remove the class if the package is disabled
    this.body.classList.remove('atom-soft-tabs-length');

    // dispose the package observer
    this.observer.dispose();
  },

  // observe settings
  observe() {

    // observe hideIndentGuide property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.hideIndentGuide', {}, (value) => {
      this.setIndentGuide(value);
    }));

    // observe ignorePattern property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.ignorePattern', {}, (value) => {
      this.setIgnorePattern(value);
    }));

    // observe notificationScope property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.notificationScope', {}, () => {
      this.setNotificationScope();
    }));

    // observe softTabsLength property
    this.observer.add(atom.config.observe('atom-soft-tabs-length.softTabsLength', {}, (value) => {
      this.setSoftTabsLength(value);
    }));

    // observe tabLength property
    this.observer.add(atom.config.observe('editor.tabLength', {}, (value) => {
      this.setSoftTabsLength(value);
    }));

    // observe invisibles space property
    this.observer.add(atom.config.observe('editor.invisibles.space', {}, (value) => {
      this.setInvisiblesSpace(value);
    }));

    // observe text editors and search for an .editorconfig file
    this.observer.add(atom.workspace.observeTextEditors((editor) => {
      this.run(editor);
    }));

    // observe projects history
    this.observer.add(atom.history.onDidChangeProjects(() => {
      this.cleanScopes();
    }));
  },

  // main run method that works per TextEditor
  run(editor) {

    // exit if there is no path associated to the file
    if (typeof editor.getPath() === 'undefined') {
      return;
    }

    // get the project path from the editor
    const projectPath = atom.project.relativizePath(editor.getPath())[0];

    // exist if there is no project associated to the file
    if (projectPath === null) {
      return;
    }

    // get the current directory for this project path and editor buffer file
    const directory = new Directory(projectPath);
    const file = editor.buffer.file;

    // exclude some paths depending on the user ignore pattern setting
    if (atom.config.get('atom-soft-tabs-length.ignorePattern') !== '') {
      try {

        // exit if the ignore pattern match the current editor path, and remove the soft-tabs-length attribute from the TextEditor
        if (new RegExp(atom.config.get('atom-soft-tabs-length.ignorePattern')).test(file.getPath())) {
          atom.views.getView(editor).removeAttribute('data-soft-tabs-length');
          return;
        }
      } catch(exception) {
        atom.notifications.addError('atom-soft-tabs-length', {
          description: `The ignore pattern setting contains an **invalid regular expression**:\n*${exception}*\n\nThe soft tabs length setting is disabled for each paths until you fix it.`,
          dismissable: true
        });

        return;
      }
    }

    // get the editor config file
    const editorConfigFile = directory.getFile('.editorconfig');

    // exit if the editor config file doesn't exists
    if (!editorConfigFile.existsSync()) {
      return;
    }

    // parse the .editorconfig file
    let properties = EditorConfig.parseSync(editorConfigFile.getPath());

    // exit if the .editorconfig file doesn't contain indent format
    if (!('indent_size' in properties) || !('indent_style' in properties)) {
      return;
    }

    // detect if the indent format differs from the editor configuration
    if (properties.indent_style === 'space' && properties.indent_size !== atom.config.get('editor.tabLength')) {

      // enable the editor indent guide
      atom.config.set('editor.showIndentGuide', true);

      // set the soft tabs length setting to the editor view
      atom.views.getView(editor).setAttribute('data-soft-tabs-length', this.length);

      // display a notification depending on the user scope setting
      switch (atom.config.get('atom-soft-tabs-length.notificationScope')) {
        case 'project':
          if (this.scopes.indexOf(projectPath) === -1) {
            this.scopes.push(projectPath);

            atom.notifications.addInfo(`${directory.getBaseName()}`, {
              description: `The editor tab length differs from the project's \`.editorconfig\` indent size.\n\nAll files in this project will display a tab length of **${this.length} virtual spaces**, but indentation is still set to **${properties.indent_size} spaces** in the source code.`,
              dismissable: true
            });
          }

          break;
        case 'file':
          atom.notifications.addInfo(`${file.getBaseName()}`, {
            description: `The editor tab length differs from the project's \`.editorconfig\` indent size.\n\nThis file is now displayed with a tab length of **${this.length} virtual spaces**, but indentation is still set to **${properties.indent_size} spaces** in the source code.`,
            dismissable: true
          });

          break;
      }
    }
  },

  // remove unused scopes
  cleanScopes() {
    let projects = atom.history.getProjects()[0];

    if (typeof projects === 'undefined') {
      return;
    }

    let paths = projects.paths;
    let scopes = this.scopes;

    scopes.forEach((scope) => {
      if (paths.indexOf(scope) === -1) {
        this.scopes.splice(this.scopes.indexOf(scope), 1);
      }
    });
  },

  // set the indent guide
  setIndentGuide(value) {
    if (value) {
      this.body.classList.add('no-guide');
    } else {
      this.body.classList.remove('no-guide');
    }
  },

  // set the ignore pattern
  setIgnorePattern() {

    // update all text editor views to fit to the new settings
    atom.workspace.getTextEditors().forEach((editor) => {
      this.run(editor);
    });
  },

  // set the notification scope
  setNotificationScope() {
    this.scopes = [];
  },

  // set the soft tabs length
  setSoftTabsLength(value) {

    // use the editor tab length when the soft tabs length setting is set to 'auto'
    this.length = parseInt(value === 'auto' ? atom.config.get('editor.tabLength') : value);

    // update all text editor views to fit to the new settings
    atom.workspace.getTextEditors().forEach((editor) => {
      const view = atom.views.getView(editor);

      if (view.hasAttribute('data-soft-tabs-length')) {
        view.setAttribute('data-soft-tabs-length', this.length);
      }
    });
  },

  // set the invisibles space character
  setInvisiblesSpace(value) {
    let char = this.body.getAttribute('data-soft-tabs-invisible-space');

    if (char === null) {
      this.body.setAttribute('style', `--soft-tabs-invisible-space:'${value}';${this.body.getAttribute('style') || ''}`);
    } else {
      this.body.setAttribute('style', this.body.getAttribute('style').replace(`--soft-tabs-invisible-space:'${char}';`, `--soft-tabs-invisible-space:'${value}';`));
      this.body.setAttribute('data-soft-tabs-invisible-space', value);
    }
  }
};
