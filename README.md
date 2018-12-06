# Atom soft tabs length – [![apm](https://img.shields.io/apm/v/atom-soft-tabs-length.svg)](https://atom.io/packages/atom-soft-tabs-length)
Atom package to support soft tabs length.

![Atom soft tabs length](logo.png "Atom soft tabs length")


## Install
The package is published on the **APM** *(Atom Package Manager)* registry, so you can install it through the command line interpreter using:

```console
apm install atom-soft-tabs-length
```


## Usage
Atom **soft tabs aren't configurable** the way hard tabs are, that's why this package comes to the rescue: it provide an easy way to display consistent soft tabs length between different editors configurations.

Pretend that your are working on a project with `soft tabs` of `2 spaces`. A new developer join your team, but he usually works with `soft tabs` of `4 spaces`... that's a problem, because you don't want **your source code to contain both** 2 spaces and 4 spaces.


## How it works
The package is built upon the great **EditorConfig** mechanism: it look for an `.editorconfig` file **in the project's root directory** to detect indentation style, based on the `indent_style` and `indent_size` properties, whether to apply soft tabs length. If no configuration file is found, no soft tabs length will be applied, and the editor will display the soft tabs normally.

To properly display the soft tabs based on your coding styles, the package simulates the presence of invisible spaces, or **virtual spaces**, to represent your soft tabs. To make it work, it requires the **indent guide** to be enabled in order to tweak the indentation width/size on the Atom interface. By default the Atom styles are override and the indent guide is hide, but you can easily choose whether to display or not the indent guide in the package settings.

For now, the package officially only support `2 spaces` and `4 spaces` soft tabs length.


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
