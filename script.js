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
        this.currentPage = 1;
        this.linesPerPage = 55; // Standard screenplay lines per page
        this.pages = [];
        this.allLines = []; // Keep track of all lines across all pages
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateWordCount();
        this.updateCursorPosition();
        this.loadFromLocalStorage();
        this.calculatePages();
        this.showPage(1);
    }

    setupEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.handleInput();
            this.updateWordCount();
            this.autoSave();
            this.calculatePages();
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
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goToPreviousPage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goToNextPage();
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
            this.insertFormattedText(text);
        });
    }

    calculatePages() {
        this.allLines = Array.from(this.editor.querySelectorAll('.script-line'));
        this.pages = [];
        let currentPageLines = [];
        let lineCount = 0;

        this.allLines.forEach((line, index) => {
            // Calculate line height based on element type
            let linesUsed = this.getLinesUsedByElement(line.dataset.type);

            // Check if adding this line would exceed page limit
            if (lineCount + linesUsed > this.linesPerPage && currentPageLines.length > 0) {
                this.pages.push([...currentPageLines]);
                currentPageLines = [];
                lineCount = 0;
            }

            currentPageLines.push(line);
            lineCount += linesUsed;
        });

        // Add the last page if it has content
        if (currentPageLines.length > 0) {
            this.pages.push(currentPageLines);
        }

        // Ensure at least one page exists
        if (this.pages.length === 0) {
            this.pages.push([]);
        }

        this.updatePageDisplay();
    }

    getLinesUsedByElement(type) {
        switch (type) {
            case 'scene-heading':
            case 'character':
                return 2; // Extra spacing above
            case 'fade-in':
            case 'fade-out':
                return 3; // Extra spacing
            default:
                return 1;
        }
    }

    getCurrentPageLineCount() {
        if (!this.pages[this.currentPage - 1]) return 0;
        
        let lineCount = 0;
        this.pages[this.currentPage - 1].forEach(line => {
            lineCount += this.getLinesUsedByElement(line.dataset.type);
        });
        return lineCount;
    }

    updatePageDisplay() {
        const totalPages = this.pages.length;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('currentPageInput').value = this.currentPage;
        document.getElementById('currentPageInput').max = totalPages;
        
        // Update button states
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
        
        // Add visual styling for disabled buttons
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.pages.length) return;
        
        this.currentPage = pageNumber;
        
        // Hide all lines first
        this.allLines.forEach(line => {
            line.style.display = 'none';
        });

        // Show only lines for current page
        if (this.pages[pageNumber - 1]) {
            this.pages[pageNumber - 1].forEach(line => {
                line.style.display = 'block';
            });
        }

        this.updatePageDisplay();
    }

    goToNextPage() {
        if (this.currentPage < this.pages.length) {
            this.showPage(this.currentPage + 1);
            // Set cursor to the first line of the new page
            setTimeout(() => {
                const firstLineOnPage = this.pages[this.currentPage - 1]?.[0];
                if (firstLineOnPage) {
                    this.setCursorAtStart(firstLineOnPage);
                }
            }, 50);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
            // Set cursor to the last line of the previous page
            setTimeout(() => {
                const lastLineOnPage = this.pages[this.currentPage - 1]?.slice(-1)[0];
                if (lastLineOnPage) {
                    this.setCursorAtEnd(lastLineOnPage);
                }
            }, 50);
        }
    }

    goToPage(pageNumber) {
        const page = parseInt(pageNumber);
        if (page >= 1 && page <= this.pages.length) {
            this.showPage(page);
            // Set cursor to the first line of the target page
            setTimeout(() => {
                const firstLineOnPage = this.pages[page - 1]?.[0];
                if (firstLineOnPage) {
                    this.setCursorAtStart(firstLineOnPage);
                }
            }, 50);
        }
    }

    checkPageLimitAndAdvance() {
        const currentPageLineCount = this.getCurrentPageLineCount();
        const currentLine = this.getCurrentLine();
        
        if (currentLine) {
            const currentLineUsage = this.getLinesUsedByElement(currentLine.dataset.type);
            
            // If adding a new line would exceed the limit, move to next page
            if (currentPageLineCount + currentLineUsage >= this.linesPerPage) {
                // Check if we need to create a new page
                if (this.currentPage >= this.pages.length) {
                    // Create new page automatically
                    setTimeout(() => {
                        this.calculatePages();
                        this.goToNextPage();
                    }, 100);
                } else {
                    this.goToNextPage();
                }
                return true; // Indicates page was advanced
            }
        }
        return false;
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
                // Check if we need to advance to next page before adding new line
                const pageAdvanced = this.checkPageLimitAndAdvance();
                if (!pageAdvanced) {
                    this.handleEnterKey(currentLine);
                } else {
                    // If page was advanced, add the new line on the new page
                    setTimeout(() => {
                        this.handleEnterKey(currentLine);
                    }, 150);
                }
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
            // Recalculate pages after removing line
            setTimeout(() => {
                this.calculatePages();
                // Ensure we're on the correct page
                const pageWithPrevLine = this.findPageForLine(prevLine);
                if (pageWithPrevLine && pageWithPrevLine !== this.currentPage) {
                    this.showPage(pageWithPrevLine);
                }
            }, 50);
        }
    }

    findPageForLine(targetLine) {
        for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
            if (this.pages[pageIndex].includes(targetLine)) {
                return pageIndex + 1;
            }
        }
        return null;
    }

    insertNewLine(type = 'scene-heading') {
        const newLine = document.createElement('div');
        newLine.className = `script-line ${type}`;
        newLine.dataset.type = type;
        newLine.textContent = '';
        
        const currentLine = this.getCurrentLine();
        
        if (currentLine) {
            currentLine.parentNode.insertBefore(newLine, currentLine.nextSibling);
        } else {
            this.editor.appendChild(newLine);
        }
        
        // Set cursor in new line
        this.setCursorAtStart(newLine);
        this.elementType.value = type;
        
        // Recalculate pages and check if we need to move to next page
        setTimeout(() => {
            this.calculatePages();
            const pageWithNewLine = this.findPageForLine(newLine);
            if (pageWithNewLine && pageWithNewLine !== this.currentPage) {
                this.showPage(pageWithNewLine);
            }
        }, 50);
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
        const text = line.textContent.trim();
        
        // Use the same detection logic as paste functionality
        const detectedType = this.detectElementTypeFromText(text);
        
        // Only apply auto-formatting for very obvious cases to avoid interfering with user intent
        // We'll be more conservative here than in paste detection
        if (text.match(/^(INT\.|EXT\.)\s/) || 
            text === 'FADE IN:' || 
            text === 'FADE OUT.' || 
            text === 'FADE OUT' ||
            text.match(/^(CUT TO:|DISSOLVE TO:)$/i)) {
            this.setLineType(line, detectedType);
        }
    }

    setLineType(line, type) {
        // Remove all type classes
        line.className = 'script-line';
        line.classList.add(type);
        line.dataset.type = type;
        
        // Update dropdown
        this.elementType.value = type;
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

    insertFormattedText(text) {
        // Split text into lines and process each one
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const currentLine = this.getCurrentLine();
        let insertionPoint = currentLine;

        lines.forEach((lineText, index) => {
            // Detect element type based on content
            const elementType = this.detectElementTypeFromText(lineText.trim());
            
            // Create new line element
            const newLine = document.createElement('div');
            newLine.className = `script-line ${elementType}`;
            newLine.dataset.type = elementType;
            newLine.textContent = lineText.trim();
            
            // Insert the line
            if (insertionPoint && insertionPoint.parentNode) {
                insertionPoint.parentNode.insertBefore(newLine, insertionPoint.nextSibling);
            } else {
                this.editor.appendChild(newLine);
            }
            
            insertionPoint = newLine; // Update insertion point for next line
        });

        // Set cursor to the last inserted line
        if (insertionPoint) {
            this.setCursorAtEnd(insertionPoint);
        }

        // Recalculate pages and update display
        setTimeout(() => {
            this.calculatePages();
            const pageWithLastLine = this.findPageForLine(insertionPoint);
            if (pageWithLastLine && pageWithLastLine !== this.currentPage) {
                this.showPage(pageWithLastLine);
            }
        }, 100);
    }

    detectElementTypeFromText(text) {
        const upperText = text.toUpperCase();
        
        // Scene headings - starts with INT. or EXT. followed by space
        if (upperText.match(/^(INT\.|EXT\.)\s/)) {
            return 'scene-heading';
        }
        
        // Specific transitions
        if (upperText === 'FADE IN:') {
            return 'fade-in';
        }
        if (upperText === 'FADE OUT.' || upperText === 'FADE OUT') {
            return 'fade-out';
        }
        if (upperText.match(/^(CUT TO:|DISSOLVE TO:|MATCH CUT:|JUMP CUT:|SMASH CUT:)$/)) {
            return 'transition';
        }
        
        // Parentheticals - text wrapped in parentheses
        if (text.match(/^\([^)]*\)$/)) {
            return 'parenthetical';
        }
        
        // Character names - all caps, short lines (likely speaker names)
        // Check if it's all uppercase, no punctuation except parentheses, and reasonable length
        if (upperText === text && 
            text.match(/^[A-Z][A-Z\s]*(\([^)]*\))?$/) && 
            text.length <= 50 &&
            !text.includes('.') && 
            !text.includes(',') &&
            !text.includes('!') &&
            !text.includes('?')) {
            return 'character';
        }
        
        // Additional scene heading patterns
        if (upperText.match(/^(INTERIOR|EXTERIOR)/)) {
            return 'scene-heading';
        }
        
        // More transition patterns
        if (upperText.match(/(FADE TO BLACK|FADE TO WHITE|FADE IN FROM BLACK|FADE IN FROM WHITE)$/)) {
            return 'transition';
        }
        
        // Time transitions
        if (upperText.match(/^(LATER|MEANWHILE|EARLIER|THE NEXT DAY|MOMENTS LATER|SUDDENLY)$/)) {
            return 'transition';
        }
        
        // Default to action for everything else
        return 'action';
    }

    insertText(text) {
        // For single line insertions, use the simpler method
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
        scriptWriter.calculatePages();
        scriptWriter.showPage(1);
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

// Global functions for page navigation
function goToNextPage() {
    scriptWriter.goToNextPage();
}

function goToPreviousPage() {
    scriptWriter.goToPreviousPage();
}

function goToPage(pageNumber) {
    scriptWriter.goToPage(pageNumber);
}

// Initialize the application
let scriptWriter;
document.addEventListener('DOMContentLoaded', () => {
    scriptWriter = new ScriptWriter();
    updateStatus('ScriptWriter Pro loaded - Ready to write!');
}); 