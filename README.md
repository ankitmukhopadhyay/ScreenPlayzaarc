# ScreenPlayzaarc - Professional Screenwriting Software

**ScreenPlayzaarc** is a comprehensive desktop screenwriting application that provides industry-standard screenplay formatting with intelligent auto-detection, professional export capabilities, and a modern, intuitive interface. Built with Electron for cross-platform compatibility.

![ScreenPlayzaarc](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🎬 Professional Script Formatting
- **Industry-Standard Layout**: Courier New 12pt font with proper margins and indentation
- **Intelligent Auto-Formatting**: Automatically detects and formats script elements as you type
- **Complete Element Support**: Scene headings, action, character names, dialogue, parentheticals, transitions, fade in/out
- **Smart Text Detection**: Recognizes INT./EXT. scene headings, character names, and transitions automatically
- **Perfect Alignment**: Character names, dialogue, and parentheticals positioned according to industry standards

### 📁 Custom .szaarc File Format
- **Native File Format**: Save projects as .szaarc files with complete metadata
- **Rich Metadata**: Includes title, creation date, modification date, word count, and page count
- **JSON-Based Structure**: Human-readable format with version tracking
- **File Association**: Double-click .szaarc files to open directly in ScreenPlayzaarc
- **Cross-Platform Compatibility**: Works seamlessly across Windows, macOS, and Linux

### 🚀 Smart Writing Features
- **Auto-Parenthetical Detection**: Automatically converts dialogue starting with "(" to parenthetical format
- **Intelligent Element Flow**: Character → Dialogue → Character progression, Parenthetical → Dialogue flow
- **Smart Paste**: Intelligently formats pasted content with automatic element type detection
- **Real-Time Formatting**: See your script formatted perfectly as you type
- **Tab Cycling**: Quickly cycle through element types with the Tab key

### 📄 Professional Export Options
- **PDF Export**: Industry-standard PDF with perfect view-to-export synchronization
- **DOC Export**: Microsoft Word compatible format with preserved formatting
- **Perfect Pagination**: Accurate 55-line-per-page standard with element-aware spacing
- **Uppercase Conversion**: Automatic uppercase for scene headings, characters, and transitions

### 🖥️ Desktop Application Features
- **Native Desktop App**: Built with Electron for professional desktop experience
- **Complete Menu System**: File, Edit, Format, View, and Help menus with full functionality
- **Keyboard Shortcuts**: Comprehensive shortcut support for all major functions
- **File Dialogs**: Native open/save dialogs with .szaarc file filtering
- **Window Management**: Professional window handling with proper title updates

### 📊 Advanced Page Management
- **Accurate Pagination**: PDF-synchronized page calculation using exact measurements
- **Page Navigation**: Previous/Next buttons with direct page number input
- **Real-Time Page Count**: Live updates as you write with accurate page estimation
- **Element-Aware Spacing**: Proper spacing calculations for all script elements
- **View Synchronization**: Perfect alignment between editor view and PDF export

## 🎯 Getting Started

### Installation
1. Download `ScreenPlayzaarc-Portable.exe` (67.9 MB)
2. Run the executable - no installation required for portable version
3. Alternatively, download the installer for full system integration

### First Steps
1. **Start Writing**: Launch ScreenPlayzaarc and begin with the sample content
2. **Choose Element Type**: Use the dropdown or let auto-detection format your text
3. **Navigate Pages**: Use page navigation to move through your script
4. **Save Your Work**: Use Ctrl+S or File > Save to create a .szaarc file
5. **Export**: Generate PDF or DOC files for sharing and submission

### Quick Writing Guide
```
FADE IN:                           ← Auto-detects as Fade In
INT. COFFEE SHOP - MORNING         ← Auto-detects as Scene Heading
A bustling coffee shop...          ← Auto-detects as Action
SARAH                              ← Auto-detects as Character (ALL CAPS)
I'll take a large coffee.          ← Auto-detects as Dialogue
(checking her phone)               ← Auto-detects as Parenthetical
Make it a double.                  ← Continues as Dialogue
CUT TO:                            ← Auto-detects as Transition
```

## ⌨️ Keyboard Shortcuts

### File Operations
- `Ctrl+N` / `Cmd+N` - New Script
- `Ctrl+O` / `Cmd+O` - Open Script (.szaarc)
- `Ctrl+S` / `Cmd+S` - Save Script
- `Ctrl+Shift+S` / `Cmd+Shift+S` - Save As
- `Ctrl+E` / `Cmd+E` - Export as PDF
- `Ctrl+Shift+E` / `Cmd+Shift+E` - Export as DOC

### Editing
- `Enter` - New line with intelligent element type selection
- `Tab` - Cycle through element types
- `Backspace` - Delete empty lines and return to previous
- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Y` / `Cmd+Shift+Z` - Redo

### Formatting
- `Ctrl+1` / `Cmd+1` - Scene Heading
- `Ctrl+2` / `Cmd+2` - Action
- `Ctrl+3` / `Cmd+3` - Character
- `Ctrl+4` / `Cmd+4` - Dialogue
- `Ctrl+5` / `Cmd+5` - Parenthetical
- `Ctrl+6` / `Cmd+6` - Transition

### Navigation
- `Ctrl+Left` / `Cmd+Left` - Previous Page
- `Ctrl+Right` / `Cmd+Right` - Next Page
- `Ctrl++` / `Cmd++` - Zoom In
- `Ctrl+-` / `Cmd+-` - Zoom Out
- `Ctrl+0` / `Cmd+0` - Reset Zoom

## 🔧 Technical Specifications

### System Requirements
- **Windows**: Windows 10 or later (x64)
- **macOS**: macOS 10.14 or later
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 100MB free space
- **Display**: 1024x768 minimum resolution

### Technologies
- **Framework**: Electron 27.x
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Generation**: jsPDF with Courier New font support
- **Icons**: Font Awesome 6.0
- **Build System**: electron-builder with cross-platform support

### File Format Specification (.szaarc)
```json
{
  "format": "szaarc",
  "version": "1.0.0",
  "application": "ScreenPlayzaarc",
  "title": "Your Script Title",
  "content": "<div class='script-line scene-heading'>...</div>",
  "created": "2025-01-01T12:00:00.000Z",
  "lastModified": "2025-01-01T12:30:00.000Z",
  "wordCount": "1250",
  "pageCount": "5"
}
```

## 📝 Script Element Guide

### Scene Headings
```
INT. BEDROOM - NIGHT
EXT. PARK - DAY
INT./EXT. CAR - CONTINUOUS
```
- Always start with INT. or EXT.
- Include location and time
- Automatically formatted in bold uppercase

### Action Lines
```
Sarah enters the room, looking around nervously. The shadows 
from the window blinds create an ominous pattern on the wall.
```
- Present tense, active voice
- Full width (6 inches maximum)
- Left-aligned

### Character Names
```
SARAH
JOHN (O.S.)
MARY (V.O.)
```
- All uppercase, bold
- Centered position (3.5 inches from left)
- Maximum 2-inch width

### Dialogue
```
I can't believe you did that. We talked about this 
before, and you promised it wouldn't happen again.
```
- Centered under character name
- 3.5-inch maximum width
- Left margin at 2.5 inches

### Parentheticals
```
(sarcastically)
(to herself)
(checking her phone)
```
- Italic formatting
- Centered at 3 inches from left
- Used sparingly for essential direction

### Transitions
```
FADE IN:
CUT TO:
DISSOLVE TO:
FADE OUT.
```
- Right-aligned
- Bold uppercase
- Used between scenes

## 🎨 User Interface

### Modern Design
- **Professional Gradient Header**: Blue-purple gradient with ScreenPlayzaarc branding
- **Clean Toolbar**: Element type selector and quick-insert buttons
- **Intuitive Editor**: White background with proper script margins
- **Status Bar**: Word count, page information, and cursor position
- **Modal Dialogs**: Professional save and export dialogs

### Visual Feedback
- **Cursor Visibility**: Dark cursor with proper caret color
- **Text Selection**: Blue highlight with white text
- **Focus Indication**: Subtle blue background for active lines
- **Button States**: Hover effects and disabled state styling
- **Responsive Layout**: Adapts to different window sizes

## 💾 Data Management

### Auto-Save System
- **Frequency**: Every 2 seconds during active editing
- **Storage**: Browser localStorage for web version
- **Recovery**: Automatic recovery on application restart
- **Format**: Native .szaarc format with full metadata

### Project Management
- **File Association**: .szaarc files open directly in ScreenPlayzaarc
- **Recent Files**: Quick access to recently opened scripts
- **Backup**: Local storage backup prevents data loss
- **Version Tracking**: Metadata includes creation and modification dates

## 🚀 Advanced Features

### Intelligent Text Processing
- **Smart Detection**: Automatically identifies scene headings, character names, transitions
- **Context Awareness**: Understands script flow for appropriate element suggestions
- **Paste Intelligence**: Formats copied content from other applications
- **Error Prevention**: Prevents formatting issues with intelligent defaults

### Professional Output
- **PDF Synchronization**: Perfect alignment between editor view and exported PDF
- **Industry Standards**: Follows Hollywood screenplay formatting conventions
- **Print Ready**: Professional output suitable for production and submission
- **Consistent Formatting**: Maintains formatting across all export formats

### Performance Optimization
- **Efficient Pagination**: Fast page calculation for large scripts
- **Smooth Scrolling**: Optimized rendering for fluid editing experience
- **Memory Management**: Efficient handling of large documents
- **Cross-Platform**: Consistent performance across operating systems

## 🛠️ Development & Building

### Building from Source
```bash
# Clone repository
git clone https://github.com/yourusername/screenplayzaarc.git
cd screenplayzaarc

# Install dependencies
npm install

# Development mode
npm run dev

# Build for all platforms
npm run build

# Build Windows portable
npm run build-portable

# Build platform-specific
npm run build-win    # Windows installer + portable
npm run build-mac    # macOS DMG
npm run build-linux  # Linux AppImage
```

### Project Structure
```
screenplayzaarc/
├── main.js              # Electron main process
├── index.html           # Home page
├── script.html          # Script editor page
├── script.js            # Core editing functionality
├── styles.css           # Complete styling
├── package.json         # Project configuration
├── dist/                # Built applications
└── README.md           # This documentation
```

## 🎭 Writing Best Practices

### Professional Formatting
1. **Scene Headings**: Be specific with locations and time
2. **Action Lines**: Keep descriptions concise and visual
3. **Character Names**: Maintain consistency throughout script
4. **Dialogue**: Write natural, character-specific speech
5. **Parentheticals**: Use only when essential for clarity

### Productivity Tips
- Use auto-formatting for faster writing
- Navigate with keyboard shortcuts
- Save frequently with Ctrl+S
- Use page navigation for long scripts
- Export regularly to maintain backups

## 🐛 Troubleshooting

### Common Issues
- **Cursor Not Visible**: Fixed in latest version with enhanced CSS styling
- **Script Not Loading**: Ensure .szaarc file format is valid JSON
- **Export Problems**: Check file permissions and disk space
- **Performance Issues**: Close other applications for optimal performance

### Support
- **Documentation**: Complete feature documentation included
- **File Format**: .szaarc files are human-readable JSON
- **Compatibility**: Cross-platform file format ensures portability
- **Recovery**: Auto-save prevents data loss

## 📄 License

MIT License - Free for personal and commercial use.

## 🎬 Start Your Screenplay Journey

ScreenPlayzaarc provides everything you need to write professional screenplays with industry-standard formatting, intelligent features, and seamless export capabilities. Download the portable executable and start writing your next great script today!

**Download**: ScreenPlayzaarc-Portable.exe (67.9 MB)

**Ready to write? Launch ScreenPlayzaarc and bring your stories to life!** 