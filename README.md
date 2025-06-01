# ScriptWriter Pro - Professional Screenwriting Software

A comprehensive, web-based scriptwriting application that follows industry-standard screenplay formatting rules, similar to Celtx and other professional screenwriting tools.

## ✨ Features

### 🎬 Professional Script Formatting
- **Scene Headings**: Automatic INT./EXT. detection and formatting
- **Character Names**: Centered formatting with automatic uppercase conversion
- **Dialogue**: Proper indentation and width constraints
- **Action/Description**: Full-width narrative blocks
- **Parentheticals**: Italic formatting with proper positioning
- **Transitions**: Right-aligned transitions (FADE IN, FADE OUT, CUT TO, etc.)

### 🚀 Smart Writing Features
- **Auto-formatting**: Intelligent detection of script elements as you type
- **Keyboard Shortcuts**: 
  - `Enter`: Creates new line with contextually appropriate element type
  - `Tab`: Cycles through element types
  - `Ctrl/Cmd + S`: Save script
  - `Ctrl/Cmd + N`: New script
  - `Ctrl/Cmd + E`: Export menu
- **Auto-save**: Automatically saves your work to local storage
- **Word Count & Page Estimation**: Real-time tracking of script length

### 📄 Export Options
- **PDF Export**: Professional PDF generation with proper script formatting
- **DOC Export**: Microsoft Word compatible document export
- **HTML Save**: Save your script in HTML format

### 💻 User Interface
- **Professional Design**: Clean, modern interface optimized for writing
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Dark Theme Elements**: Comfortable for long writing sessions
- **Status Bar**: Real-time cursor position and status updates

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in any modern web browser
2. The application loads with a sample script structure
3. Start writing immediately - the software is ready to use!

### Basic Usage

#### Writing Your First Scene
1. **Scene Heading**: Type "INT. LIVING ROOM - DAY" - it will auto-format as a scene heading
2. **Action**: Type your scene description in regular text
3. **Character**: Type a character name in ALL CAPS
4. **Dialogue**: The next line will automatically be formatted as dialogue

#### Element Types
- **Action**: Narrative description, full width
- **Scene Heading**: INT./EXT. location and time
- **Character**: Speaker name, centered and bold
- **Dialogue**: Character speech, indented
- **Parenthetical**: Stage directions in dialogue, italic
- **Transition**: Scene transitions, right-aligned
- **Fade In/Out**: Special formatting for fades

#### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Enter` | New line (smart element detection) |
| `Tab` | Cycle element types |
| `Ctrl/Cmd + S` | Save script |
| `Ctrl/Cmd + N` | New script |
| `Ctrl/Cmd + E` | Export menu |
| `Backspace` on empty line | Delete line and return to previous |

## 📋 Script Formatting Standards

ScriptWriter Pro follows industry-standard screenplay formatting:

### Scene Headings
```
INT. COFFEE SHOP - MORNING
EXT. PARK - SUNSET
```

### Action Lines
```
John walks into the coffee shop, scanning the room for an empty table. 
The morning rush has left the place bustling with activity.
```

### Character and Dialogue
```
                    JOHN
          I'll have a large coffee, black.

                    BARISTA
          Coming right up!

                    JOHN
                 (checking his watch)
          Actually, make that two.
```

### Transitions
```
                                        FADE IN:

                                        CUT TO:

                                        FADE OUT.
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic structure and content editing
- **CSS3**: Professional styling with flexbox and grid layouts
- **Vanilla JavaScript**: Core functionality and interactions
- **jsPDF**: PDF generation
- **Font Awesome**: Professional icons

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### File Structure
```
scriptwriter-pro/
├── index.html          # Main application file
├── styles.css          # Complete styling
├── script.js           # Core JavaScript functionality
└── README.md          # This documentation
```

## 📱 Responsive Design

The application is fully responsive and works across all device sizes:

- **Desktop**: Full-featured experience with all tools
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Simplified interface maintaining all core functionality

## 💾 Data Management

### Auto-save
- Scripts are automatically saved to browser local storage every 2 seconds
- No data loss on browser refresh or accidental closure

### Export Formats
1. **PDF**: Professional screenplay format with proper margins and fonts
2. **DOC**: Microsoft Word compatible format
3. **HTML**: Preserves all formatting and can be reopened in the application

### Local Storage
Scripts are saved locally in your browser, ensuring privacy and offline access.

## 🎯 Professional Features

### Industry Standards
- Courier New font (12pt)
- Proper margins and indentation
- Standard page layout (8.5" x 11")
- Automatic page breaks in exports

### Workflow Integration
- Copy/paste support from other applications
- Import plain text and auto-format
- Export to industry-standard formats

## 🔮 Advanced Usage

### Custom Formatting
- Manual element type selection via dropdown
- Quick-insert buttons for common elements
- Real-time element type detection

### Productivity Features
- Live word count and page estimation
- Cursor position tracking
- Modal dialogs for save operations

## 🐛 Troubleshooting

### Common Issues
1. **Text not formatting**: Ensure you're typing in all caps for character names
2. **Export not working**: Check browser permissions for downloads
3. **Auto-save failing**: Verify local storage is enabled in browser settings

### Performance
- Optimized for scripts up to 200+ pages
- Smooth scrolling and editing experience
- Minimal memory footprint

## 🎭 Writing Tips

### Best Practices
1. Write scene headings in ALL CAPS
2. Keep action lines concise and present tense
3. Character names should be consistent throughout
4. Use parentheticals sparingly
5. Ensure proper scene transitions

### Professional Standards
- One page typically equals one minute of screen time
- Keep dialogue natural and speakable
- Action lines should be visual and specific
- Use proper screenplay abbreviations (V.O., O.S., etc.)

## 🤝 Contributing

This is a complete, standalone application. To modify or extend:

1. Edit HTML structure in `index.html`
2. Modify styling in `styles.css`
3. Extend functionality in `script.js`

## 📄 License

This project is open source and available for personal and commercial use.

---

**Ready to write your next screenplay? Open `index.html` and start creating!** 🎬✨ 