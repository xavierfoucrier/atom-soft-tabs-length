> :atom: Atom editor has sunsetted on Dec 15, 2022, so it's no more possible to publish packages using Atom Package Manager CLI. You can still download the source here and manually install it.

# Atom soft tabs length – [![apm](https://img.shields.io/badge/apm-v1.0.0-brightgreen)](https://atom.io/packages/atom-soft-tabs-length)
Atom package to support soft tabs length.

![Atom soft tabs length](logo.gif "Atom soft tabs length")

## Install
The package is published on the **APM** *(Atom Package Manager)* registry, so you can install it through the command line interpreter using:

```console
apm install atom-soft-tabs-length
```

## Context
Atom **soft tabs aren't configurable** the way hard tabs are, that's why this package comes to the rescue: it provide an easy way to display consistent soft tabs length between different editors configurations.

Pretend that your are working on a project with `soft tabs` of `2 spaces`. A new developer join your team, but he usually works with `soft tabs` of `4 spaces`... that's a problem, because you don't want **your source code to contain both** 2 spaces and 4 spaces.

## How it works
The package is built upon the great **EditorConfig** mechanism: it look for an `.editorconfig` file **from the project's directory to the file system root directory** and detect indentation style, based on the `indent_style` and `indent_size` properties, whether to apply soft tabs length. If no configuration file is found, no soft tabs length will be applied, and the editor will display the soft tabs normally.

### Soft tabs length
To properly display the soft tabs based on your coding styles, the package simulates the presence of invisible spaces, or **virtual spaces**, to represent your soft tabs. To make it work, it requires the **indent guide** to be enabled in order to tweak the indentation width/size on the Atom interface. By default the Atom styles are override and the indent guide is hide, but you can easily choose whether to display or not the indent guide in the package settings.

> For now, the package officially only support `2 spaces` and `4 spaces` soft tabs length

### Notification
When applying soft tabs length to the current editor, the package displays **scoped notifications** depending on the user setting:
- `Project` displays a single notification as soon as you open **any files** in the current project
- `File` displays a single notification **for each files** in the current project
- `None` disables scoped notifications

### Ignore pattern
You can **exclude some paths** with a `Regex` pattern to tell the package to not apply the soft tabs length setting on specific files, folders, extensions, etc.
- `(app)|(index).js$` ignores `app.js` and `index.js` files
- `\\git-repo\\` ignores `git-repo` folder
- `.css$` ignores everything that ends with `.css` extensions

> Remember that the regular expression is applied to the **full path** of the file

## Contribute
If you want to report a bug or if you just want to request for a new feature/improvement, please feel free to **fill an issue**. Thanks for taking time to contribute to this package.

## License
The project is developed under the **MIT** license:

- **Permissions**: This software and derivatives may be used for commercial purposes, you may distribute this software, this software may be modified and you may use and modify the software without distributing it.
- **Conditions**: Include a copy of the license and copyright notice with the code.
- **Limitations**: Software is provided without warranty and the software author/license owner cannot be held liable for damages.

Read the [full license](LICENSE.md) for more information about your rights.

## Questions?
If you have any questions, please **feel free to contact me!**  
[xavier.foucrier [at] gmail.com](mailto:xavier.foucrier@gmail.com)
