// ScriptWriter Pro - Professional Screenwriting Software
class ScriptWriter {
    constructor() {
        this.editor = document.getElementById('scriptEditor');
        this.elementType = document.getElementById('elementType');
        this.currentScript = {
            title: 'Untitled Script',
            content: '',
            lastModified: new Date()
        };
        this.userSetType = false; // Track if user manually set element type
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateWordCount();
        this.updateCursorPosition();
        this.loadFromLocalStorage();
    }

    setupEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.handleInput();
            this.updateWordCount();
            this.autoSave();
        });

        this.editor.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        this.editor.addEventListener('click', () => {
            this.updateCursorPosition();
            this.detectCurrentElementType();
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveScript();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newScript();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.toggleExportMenu();
                        break;
                }
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                document.getElementById('exportMenu').classList.remove('show');
            }
        });

        // Auto-resize and formatting
        this.editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            this.insertText(text);
        });
    }

    handleInput() {
        const currentLine = this.getCurrentLine();
        
        // Only auto-format if the user hasn't manually set the type
        if (currentLine && !this.userSetType) {
            this.autoFormat(currentLine);
        }
        
        // Reset the flag after handling input
        this.userSetType = false;
    }

    handleKeydown(e) {
        const currentLine = this.getCurrentLine();
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.handleEnterKey(currentLine);
                break;
            case 'Tab':
                e.preventDefault();
                this.cycleElementType();
                break;
            case 'Backspace':
                if (currentLine && currentLine.textContent.trim() === '') {
                    e.preventDefault();
                    this.handleBackspaceOnEmptyLine(currentLine);
                }
                break;
        }
    }

    handleEnterKey(currentLine) {
        const currentType = currentLine ? currentLine.dataset.type : 'scene-heading';
        let nextType = this.getNextElementType(currentType);
        
        // Special handling for character -> dialogue
        if (currentType === 'character') {
            nextType = 'dialogue';
        } else if (currentType === 'dialogue') {
            nextType = 'character';
        }
        
        this.insertNewLine(nextType);
    }

    handleBackspaceOnEmptyLine(currentLine) {
        const prevLine = currentLine.previousElementSibling;
        if (prevLine) {
            currentLine.remove();
            this.setCursorAtEnd(prevLine);
        }
    }

    getCurrentLine() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;
        
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        
        while (node && !node.classList?.contains('script-line')) {
            node = node.parentNode;
        }
        
        return node;
    }

    autoFormat(line) {
        const text = line.textContent.trim().toUpperCase();
        
        // Only auto-detect very specific and obvious cases
        // Auto-detect scene headings (INT./EXT. at the beginning)
        if (text.match(/^(INT\.|EXT\.)\s/)) {
            this.setLineType(line, 'scene-heading');
        }
        // Auto-detect specific transitions (only exact matches)
        else if (text === 'FADE IN:' || text === 'FADE OUT.' || text === 'CUT TO:' || text === 'DISSOLVE TO:') {
            if (text === 'FADE IN:') {
                this.setLineType(line, 'fade-in');
            } else if (text === 'FADE OUT.') {
                this.setLineType(line, 'fade-out');
            } else {
                this.setLineType(line, 'transition');
            }
        }
        // Remove automatic character detection - let users manually set this
    }

    setLineType(line, type) {
        // Remove all type classes
        line.className = 'script-line';
        line.classList.add(type);
        line.dataset.type = type;
        
        // Update dropdown
        this.elementType.value = type;
    }

    insertNewLine(type = 'scene-heading') {
        const newLine = document.createElement('div');
        newLine.className = `script-line ${type}`;
        newLine.dataset.type = type;
        newLine.textContent = '';
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const currentLine = this.getCurrentLine();
        
        if (currentLine) {
            currentLine.parentNode.insertBefore(newLine, currentLine.nextSibling);
        } else {
            this.editor.appendChild(newLine);
        }
        
        // Set cursor in new line
        this.setCursorAtStart(newLine);
        this.elementType.value = type;
    }

    setCursorAtEnd(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    setCursorAtStart(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    getNextElementType(currentType) {
        const typeOrder = ['scene-heading', 'action', 'character', 'dialogue', 'parenthetical', 'transition'];
        const currentIndex = typeOrder.indexOf(currentType);
        return currentIndex !== -1 && currentIndex < typeOrder.length - 1 
            ? typeOrder[currentIndex + 1] 
            : 'scene-heading';
    }

    cycleElementType() {
        const currentLine = this.getCurrentLine();
        if (!currentLine) return;
        
        const nextType = this.getNextElementType(currentLine.dataset.type);
        this.setLineType(currentLine, nextType);
        this.userSetType = true; // Mark that user manually set the type
    }

    detectCurrentElementType() {
        const currentLine = this.getCurrentLine();
        if (currentLine && currentLine.dataset.type) {
            this.elementType.value = currentLine.dataset.type;
        }
    }

    insertText(text) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    updateWordCount() {
        const text = this.editor.textContent || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('wordCount').textContent = words;
        
        // Estimate page count (250 words per page average for scripts)
        const pages = Math.max(1, Math.ceil(words / 250));
        document.getElementById('currentPage').textContent = pages;
    }

    updateCursorPosition() {
        // Simple line/column calculation
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const lines = this.editor.querySelectorAll('.script-line');
            let lineNumber = 1;
            let columnNumber = 1;
            
            const currentLine = this.getCurrentLine();
            if (currentLine) {
                lineNumber = Array.from(lines).indexOf(currentLine) + 1;
                const range = selection.getRangeAt(0);
                columnNumber = range.startOffset + 1;
            }
            
            document.getElementById('cursorPosition').textContent = `Line ${lineNumber}, Column ${columnNumber}`;
        }
    }

    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveToLocalStorage();
        }, 2000);
    }

    saveToLocalStorage() {
        this.currentScript.content = this.editor.innerHTML;
        this.currentScript.lastModified = new Date();
        localStorage.setItem('scriptwriter_current_script', JSON.stringify(this.currentScript));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('scriptwriter_current_script');
        if (saved) {
            try {
                this.currentScript = JSON.parse(saved);
                // Don't auto-load content to preserve the example
                // this.editor.innerHTML = this.currentScript.content;
            } catch (e) {
                console.warn('Could not load saved script:', e);
            }
        }
    }
}

// Global functions for UI interactions
function newScript() {
    if (confirm('Are you sure you want to start a new script? Any unsaved changes will be lost.')) {
        const editor = document.getElementById('scriptEditor');
        editor.innerHTML = `
            <div class="script-line fade-in" data-type="fade-in">FADE IN:</div>
            <div class="script-line scene-heading" data-type="scene-heading">INT. LOCATION - TIME</div>
            <div class="script-line action" data-type="action">Enter your story description here.</div>
        `;
        scriptWriter.currentScript = {
            title: 'Untitled Script',
            content: '',
            lastModified: new Date()
        };
        scriptWriter.updateWordCount();
    }
}

function saveScript() {
    document.getElementById('saveModal').classList.add('show');
    document.getElementById('scriptTitle').focus();
}

function closeSaveModal() {
    document.getElementById('saveModal').classList.remove('show');
}

function confirmSave() {
    const title = document.getElementById('scriptTitle').value.trim();
    if (title) {
        scriptWriter.currentScript.title = title;
        scriptWriter.saveToLocalStorage();
        
        // Also save as downloadable file
        const content = document.getElementById('scriptEditor').innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        closeSaveModal();
        updateStatus('Script saved successfully!');
    }
}

function toggleExportMenu() {
    const menu = document.getElementById('exportMenu');
    menu.classList.toggle('show');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const editor = document.getElementById('scriptEditor');
    const lines = editor.querySelectorAll('.script-line');
    
    let yPosition = 20;
    const lineHeight = 6;
    const pageHeight = 280;
    
    doc.setFont('courier');
    doc.setFontSize(12);
    
    lines.forEach((line, index) => {
        if (yPosition > pageHeight) {
            doc.addPage();
            yPosition = 20;
        }
        
        let text = line.textContent.trim();
        const type = line.dataset.type;
        
        // Apply uppercase transformation for specific element types (matching CSS behavior)
        if (type === 'scene-heading' || type === 'character' || type === 'transition' || 
            type === 'fade-in' || type === 'fade-out') {
            text = text.toUpperCase();
        }
        
        let xPosition = 20;
        let fontStyle = 'normal';
        
        // Positioning based on element type
        switch (type) {
            case 'scene-heading':
            case 'fade-in':
            case 'fade-out':
                fontStyle = 'bold';
                break;
            case 'character':
                xPosition = 100;
                fontStyle = 'bold';
                break;
            case 'dialogue':
                xPosition = 60;
                break;
            case 'parenthetical':
                xPosition = 80;
                fontStyle = 'italic';
                break;
            case 'transition':
                xPosition = 140;
                fontStyle = 'bold';
                break;
        }
        
        doc.setFont('courier', fontStyle);
        
        // Handle text wrapping
        const maxWidth = 160 - (xPosition - 20);
        const textLines = doc.splitTextToSize(text, maxWidth);
        
        textLines.forEach((textLine, lineIndex) => {
            if (yPosition > pageHeight) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(textLine, xPosition, yPosition);
            yPosition += lineHeight;
        });
        
        yPosition += 2; // Extra spacing between elements
    });
    
    const title = scriptWriter.currentScript.title || 'Untitled Script';
    doc.save(`${title}.pdf`);
    toggleExportMenu();
    updateStatus('Script exported as PDF!');
}

function exportToDoc() {
    const editor = document.getElementById('scriptEditor');
    const lines = editor.querySelectorAll('.script-line');
    
    let docContent = `
        <html>
        <head>
            <style>
                body { font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.5; margin: 1in; }
                .scene-heading, .fade-in, .fade-out, .transition { font-weight: bold; text-transform: uppercase; }
                .character { margin-left: 3.5in; font-weight: bold; text-transform: uppercase; text-align: center; }
                .dialogue { margin-left: 2.5in; max-width: 3.5in; text-align: center; }
                .parenthetical { margin-left: 3in; font-style: italic; text-align: center; }
                .transition { text-align: right; }
                .action { margin: 1em 0; max-width: 6in; }
            </style>
        </head>
        <body>
    `;
    
    lines.forEach(line => {
        let text = line.textContent.trim();
        const type = line.dataset.type;
        
        // Apply uppercase transformation for specific element types (matching CSS behavior)
        if (type === 'scene-heading' || type === 'character' || type === 'transition' || 
            type === 'fade-in' || type === 'fade-out') {
            text = text.toUpperCase();
        }
        
        docContent += `<p class="${type}">${text}</p>`;
    });
    
    docContent += '</body></html>';
    
    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const title = scriptWriter.currentScript.title || 'Untitled Script';
    a.download = `${title}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    
    toggleExportMenu();
    updateStatus('Script exported as DOC!');
}

function changeElementType() {
    const currentLine = scriptWriter.getCurrentLine();
    if (currentLine) {
        const newType = document.getElementById('elementType').value;
        scriptWriter.setLineType(currentLine, newType);
        scriptWriter.userSetType = true; // Mark that user manually set the type
    }
}

function insertSceneHeading(type) {
    const currentLine = scriptWriter.getCurrentLine();
    if (currentLine) {
        currentLine.textContent = `${type}. LOCATION - TIME`;
        scriptWriter.setLineType(currentLine, 'scene-heading');
        scriptWriter.setCursorAtEnd(currentLine);
    } else {
        scriptWriter.insertNewLine('scene-heading');
        const newLine = scriptWriter.getCurrentLine();
        if (newLine) {
            newLine.textContent = `${type}. LOCATION - TIME`;
        }
    }
}

function insertTransition(type) {
    const currentLine = scriptWriter.getCurrentLine();
    if (currentLine) {
        currentLine.textContent = type + (type.includes(':') ? '' : ':');
        scriptWriter.setLineType(currentLine, type.includes('FADE') ? type.toLowerCase().replace(' ', '-') : 'transition');
        scriptWriter.setCursorAtEnd(currentLine);
    } else {
        scriptWriter.insertNewLine('transition');
        const newLine = scriptWriter.getCurrentLine();
        if (newLine) {
            newLine.textContent = type + (type.includes(':') ? '' : ':');
        }
    }
}

function updateStatus(message) {
    const statusBar = document.querySelector('.status-bar span');
    statusBar.textContent = message;
    setTimeout(() => {
        statusBar.textContent = 'Ready';
    }, 3000);
}

// Initialize the application
let scriptWriter;
document.addEventListener('DOMContentLoaded', () => {
    scriptWriter = new ScriptWriter();
    updateStatus('ScriptWriter Pro loaded - Ready to write!');
}); 