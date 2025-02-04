# Kleen - Comments Cleaner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)

A Node.js tool for cleaning comments from your files while preserving code structure. Supports HTML, EJS, CSS, JavaScript, TypeScript, and more.

## Features

- Removes comments from multiple file types:
  - HTML/EJS comments (`<!-- -->`, `<%-- --%>`)
  - CSS comments (`/* */`)
  - JavaScript/TypeScript comments (`//` and `/* */`)
- Preserves code structure and formatting
- Handles nested directories
- Maintains original file extensions
- Provides detailed processing statistics
- Zero external dependencies

## Installation

```bash
# Clone the repository
git clone https://github.com/immapolar/Kleen-Web-Assets.git
```

## Usage

### Basic Usage

```bash
node kleen.js
```

### Directory Structure

```
project/
├── src/           # Input
│   ├── styles.css
│   ├── main.js
│   └── index.html
└── dist/          # Output
    ├── styles.css
    ├── main.js
    └── index.html
```

> [!NOTE]  
> Always keep a backup of your source files before cleaning. This tool performs irreversible changes to your files.

> [!CAUTION]
> The tool removes all types of comments, including:
> - Documentation comments
> - License information
> - Important development notes
> Make sure to save them separately before processing.

## Supported Extensions

- HTML (.html)
- EJS (.ejs)
- CSS (.css)
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)

## Input/Output Examples

### (input.js):
```javascript
// This is a single line comment
function hello() {
    /* This is a
       multi-line comment */
    console.log('Hello World'); // End of line comment
}
```

### (output.js):
```javascript
function hello() {
    console.log('Hello World');
}
```

## Advanced Usage

### Custom Extensions
```javascript
const cleaner = new CommentsCleaner();
cleaner.processDirectory('./src', './dist', [
    '.html',
    '.vue',
    '.php'
]);
```

### Processing Files
```javascript
const cleaner = new CommentsCleaner();
cleaner.processFile(
    './src/input.js',
    './dist/output.js'
);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Error Handling

The tool provides detailed error logging:
- File access errors
- Processing failures
- Invalid directory structures

## Known Limitations

1. Does not preserve license headers
2. Removes all types of comments indiscriminately
3. May require adjustment for specific framework syntaxes

---

Made with ❤️ by Polaris
