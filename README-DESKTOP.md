# ScriptWriter Pro - Desktop Application

A professional screenwriting software with industry-standard formatting, intelligent pagination, and comprehensive export capabilities. Now available as a native desktop application for Windows, macOS, and Linux.

## Features

### 🎬 Professional Screenplay Formatting
- **Smart Auto-Formatting**: Automatic detection of script elements (Scene Headings, Action, Character, Dialogue, Parenthetical, Transitions)
- **Industry-Standard Layout**: Courier New 12pt font with proper margins and indentation
- **Element-Specific Positioning**: Automatic alignment for all screenplay elements

### 📄 Perfect Pagination
- **Real-time Page Calculation**: Industry-standard 55 lines per page
- **PDF-Synchronized Pagination**: View matches export exactly
- **Page Navigation**: Previous/Next buttons and direct page input

### 🚀 Export Capabilities
- **PDF Export**: Professional formatting with perfect text wrapping
- **DOC Export**: Microsoft Word compatible with CSS styling
- **Maintains Formatting**: All caps, positioning, and alignment preserved

### ⌨️ Efficient Workflow
- **Keyboard Shortcuts**: Comprehensive shortcuts for all functions
- **Tab Cycling**: Quick element type switching
- **Auto-Save**: Continuous saving to prevent data loss
- **Smart Paste**: Intelligent content detection when pasting

### 🖥️ Desktop Features
- **Native Menus**: Full application menus with keyboard shortcuts
- **File Operations**: Open, Save, Save As with native dialogs
- **Zoom Controls**: Zoom in/out for better readability
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone or Download** the project files
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Application**:
   ```bash
   npm start
   ```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building Executables

#### Build for All Platforms
```bash
npm run build
```

#### Build for Specific Platforms
```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

### Distribution Package
```bash
npm run dist
```

The built applications will be available in the `dist/` directory.

## Keyboard Shortcuts

### File Operations
- `Ctrl+N` (Cmd+N) - New Script
- `Ctrl+O` (Cmd+O) - Open Script
- `Ctrl+S` (Cmd+S) - Save Script
- `Ctrl+Shift+S` (Cmd+Shift+S) - Save As
- `Ctrl+E` (Cmd+E) - Export as PDF
- `Ctrl+Shift+E` (Cmd+Shift+E) - Export as DOC

### Editing
- `Enter` - New line with auto-formatting
- `Tab` - Cycle through element types
- `Backspace` - Delete empty line and move to previous

### Formatting
- `Ctrl+1` (Cmd+1) - Scene Heading
- `Ctrl+2` (Cmd+2) - Action
- `Ctrl+3` (Cmd+3) - Character
- `Ctrl+4` (Cmd+4) - Dialogue
- `Ctrl+5` (Cmd+5) - Parenthetical
- `Ctrl+6` (Cmd+6) - Transition

### Navigation
- `Ctrl+Left` (Cmd+Left) - Previous Page
- `Ctrl+Right` (Cmd+Right) - Next Page

### View
- `Ctrl++` (Cmd++) - Zoom In
- `Ctrl+-` (Cmd+-) - Zoom Out
- `Ctrl+0` (Cmd+0) - Reset Zoom
- `F12` - Toggle Developer Tools

## Usage Guide

### Starting a New Script
1. Launch ScriptWriter Pro
2. Use `File > New Script` or `Ctrl+N`
3. Begin typing - the software automatically detects element types

### Element Types & Auto-Formatting

**Scene Headings**: Type "INT." or "EXT." followed by location
```
INT. COFFEE SHOP - DAY
```

**Characters**: Type character names in ALL CAPS
```
SARAH
```

**Dialogue**: Automatically positioned after character names
```
I'll take a large coffee, black.
```

**Parentheticals**: Type text in parentheses or start dialogue with "("
```
(whispering)
```

**Transitions**: Type standard transitions
```
CUT TO:
FADE IN:
FADE OUT.
```

### Smart Features

**Auto-Detection**: The software automatically identifies:
- Scene headings starting with INT./EXT.
- Character names (ALL CAPS, no punctuation)
- Parentheticals (text in parentheses)
- Common transitions

**Element Flow**: 
- Character → Dialogue → Character (cycling)
- Parenthetical → Dialogue (automatically)
- Dialogue starting with "(" → Parenthetical (automatically)

### Saving and Exporting

**Save Options**:
- `Save`: Quick save to local storage
- `Save As`: Export as HTML file
- `Export PDF`: Professional screenplay format
- `Export DOC`: Microsoft Word compatible

**File Formats**:
- `.html` - Native format (preserves all formatting)
- `.pdf` - Industry-standard export
- `.doc` - Word-compatible format

## Technical Details

### Built With
- **Electron**: Cross-platform desktop app framework
- **HTML5/CSS3**: Modern web technologies
- **JavaScript ES6+**: Clean, modern code
- **jsPDF**: PDF generation
- **Native Dialogs**: File operations using OS dialogs

### Architecture
- **Main Process**: Electron main thread (main.js)
- **Renderer Process**: Application UI (HTML/CSS/JS)
- **IPC Communication**: Secure communication between processes
- **Local Storage**: Automatic saving and persistence

### Performance
- **Lightweight**: Optimized for fast startup and smooth operation
- **Memory Efficient**: Smart pagination reduces memory usage
- **Real-time**: Live word count and page calculation

## Customization

### Adding Features
The modular architecture makes it easy to add new features:
- Element types can be added to the `elementType` select and CSS
- Export formats can be extended in the export functions
- Keyboard shortcuts can be added to the menu template

### Styling
- Modify `styles.css` for visual customization
- Element-specific styles are clearly separated
- Responsive design adapts to different screen sizes

## Troubleshooting

### Common Issues

**App Won't Start**:
- Ensure Node.js is installed
- Run `npm install` to install dependencies
- Check for error messages in the terminal

**Export Issues**:
- Ensure sufficient disk space
- Check file permissions in the target directory
- For PDF exports, ensure jsPDF library is loaded

**Performance Issues**:
- Close unnecessary applications
- For large scripts, use page navigation
- Clear browser cache if running in development

### Getting Help
- Check the built-in keyboard shortcuts: `Help > Keyboard Shortcuts`
- Use the About dialog: `Help > About ScriptWriter Pro`
- Enable Developer Tools: `View > Toggle Developer Tools`

## Building from Source

### Requirements
- Node.js 14+
- npm or yarn
- Git (for cloning)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd scriptwriter-pro

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
```

### Customizing Builds
Modify `package.json` build configuration:
- Icons: Place in `assets/` directory
- App name: Change `productName` in build config
- Bundle ID: Modify `appId` for different platforms

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**ScriptWriter Pro** - Professional screenwriting made simple. 