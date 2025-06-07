const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        titleBarStyle: 'default',
        show: false,
        title: 'ScreenPlayzaarc'
    });

    // Load the app
    mainWindow.loadFile('index.html');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focus on the window
        if (process.platform === 'darwin') {
            app.dock.show();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Set up the menu
    createMenu();
    
    // Set up IPC handlers
    setupIpcHandlers();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Script',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('newScript()');
                    }
                },
                {
                    label: 'Open Script',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        openScript();
                    }
                },
                {
                    label: 'Save Script',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('saveScript()');
                    }
                },
                {
                    label: 'Save As...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => {
                        handleSaveAs();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Export as PDF',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('exportToPDF()');
                    }
                },
                {
                    label: 'Export as DOC',
                    accelerator: 'CmdOrCtrl+Shift+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('exportToDoc()');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectAll'
                }
            ]
        },
        {
            label: 'Format',
            submenu: [
                {
                    label: 'Scene Heading',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'scene-heading';
                            changeElementType();
                        `);
                    }
                },
                {
                    label: 'Action',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'action';
                            changeElementType();
                        `);
                    }
                },
                {
                    label: 'Character',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'character';
                            changeElementType();
                        `);
                    }
                },
                {
                    label: 'Dialogue',
                    accelerator: 'CmdOrCtrl+4',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'dialogue';
                            changeElementType();
                        `);
                    }
                },
                {
                    label: 'Parenthetical',
                    accelerator: 'CmdOrCtrl+5',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'parenthetical';
                            changeElementType();
                        `);
                    }
                },
                {
                    label: 'Transition',
                    accelerator: 'CmdOrCtrl+6',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('elementType').value = 'transition';
                            changeElementType();
                        `);
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Previous Page',
                    accelerator: 'CmdOrCtrl+Left',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('goToPreviousPage()');
                    }
                },
                {
                    label: 'Next Page',
                    accelerator: 'CmdOrCtrl+Right',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('goToNextPage()');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            const currentZoom = require('electron').webFrame.getZoomFactor();
                            require('electron').webFrame.setZoomFactor(currentZoom + 0.1);
                        `);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            const currentZoom = require('electron').webFrame.getZoomFactor();
                            require('electron').webFrame.setZoomFactor(Math.max(0.5, currentZoom - 0.1));
                        `);
                    }
                },
                {
                    label: 'Reset Zoom',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            require('electron').webFrame.setZoomFactor(1.0);
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'F12',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About ScreenPlayzaarc',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About ScreenPlayzaarc',
                            message: 'ScreenPlayzaarc',
                            detail: 'Professional Screenwriting Software\nVersion 1.0.0\n\nA powerful, intuitive screenwriting application with industry-standard formatting and professional export capabilities.\n\nSupports .szaarc script format for easy project management.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'Keyboard Shortcuts',
                    click: () => {
                        showKeyboardShortcuts();
                    }
                }
            ]
        }
    ];

    // macOS specific menu adjustments
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: 'About ' + app.getName(),
                    role: 'about'
                },
                { type: 'separator' },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                { type: 'separator' },
                {
                    label: 'Hide ' + app.getName(),
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => app.quit()
                }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function openScript() {
    dialog.showOpenDialog(mainWindow, {
        title: 'Open ScreenPlayzaarc Script',
        filters: [
            { name: 'ScreenPlayzaarc Scripts', extensions: ['szaarc'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    dialog.showErrorBox('Error', 'Could not open file: ' + err.message);
                    return;
                }
                
                try {
                    // Parse the .szaarc file (JSON format)
                    const scriptData = JSON.parse(data);
                    
                    // Validate the file format
                    if (scriptData.format !== 'szaarc') {
                        throw new Error('Invalid file format. Expected .szaarc format.');
                    }
                    
                    // Ensure we have the required content
                    if (!scriptData.content) {
                        throw new Error('No script content found in file.');
                    }
                    
                    // Store the script data temporarily in main process
                    global.pendingScriptData = scriptData;
                    
                    // First, ensure we're on the script page
                    mainWindow.webContents.executeJavaScript(`
                        // Check current page
                        window.location.pathname
                    `).then(currentPath => {
                        
                        if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
                            // Navigate to script page first
                            mainWindow.loadFile('script.html').then(() => {
                                // Wait for page to load, then load script
                                setTimeout(() => {
                                    loadScriptIntoEditor(scriptData, filePath);
                                }, 1500);
                            }).catch(error => {
                                console.error('Error loading script page:', error);
                                dialog.showErrorBox('Error', 'Failed to load script editor page.');
                            });
                        } else {
                            // Already on script page, load directly
                            loadScriptIntoEditor(scriptData, filePath);
                        }
                        
                    }).catch(error => {
                        console.error('Error checking current page:', error);
                        dialog.showErrorBox('Error', 'Failed to check current page: ' + error.message);
                    });
                    
                } catch (parseError) {
                    dialog.showErrorBox('Error', 'Invalid .szaarc file format: ' + parseError.message);
                }
            });
        }
    });
}

// Helper function to load script data into editor
function loadScriptIntoEditor(scriptData, filePath) {
    // Use simpler approach with basic JavaScript
    mainWindow.webContents.executeJavaScript(`
        // Wait for elements to be available
        function waitForEditor() {
            const editor = document.getElementById('scriptEditor');
            if (!editor || typeof scriptWriter === 'undefined') {
                setTimeout(waitForEditor, 200);
                return;
            }
            
            try {
                // Clear current content
                editor.innerHTML = '';
                
                // Load new content
                editor.innerHTML = \`${scriptData.content.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`;
                
                // Update script metadata using the new method
                if (typeof scriptWriter.loadScriptFromFile === 'function') {
                    const scriptData = {
                        title: "${scriptData.title ? scriptData.title.replace(/"/g, '\\"') : 'Untitled Script'}",
                        content: \`${scriptData.content.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`,
                        lastModified: "${scriptData.lastModified || new Date().toISOString()}",
                        created: "${scriptData.created || new Date().toISOString()}",
                        version: "${scriptData.version || '1.0.0'}",
                        format: "szaarc"
                    };
                    scriptWriter.loadScriptFromFile(scriptData, "${filePath ? filePath.replace(/\\/g, '\\\\') : ''}");
                } else {
                    // Fallback to old method
                    scriptWriter.currentScript = {
                        title: "${scriptData.title ? scriptData.title.replace(/"/g, '\\"') : 'Untitled Script'}",
                        content: \`${scriptData.content.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`,
                        lastModified: new Date("${scriptData.lastModified || new Date().toISOString()}"),
                        created: new Date("${scriptData.created || new Date().toISOString()}"),
                        version: "${scriptData.version || '1.0.0'}",
                        format: "szaarc"
                    };
                    
                    // Update UI
                    scriptWriter.calculatePages();
                    scriptWriter.showPage(1);
                    scriptWriter.updateWordCount();
                    scriptWriter.updateDocumentTitle();
                }
                
                // Update status
                if (typeof updateStatus === 'function') {
                    updateStatus('Script loaded successfully');
                }
                
                console.log('Script loaded successfully');
                true; // Return success
                
            } catch (error) {
                console.error('Error loading script:', error);
                if (typeof updateStatus === 'function') {
                    updateStatus('Error loading script: ' + error.message);
                }
                false; // Return failure
            }
        }
        
        waitForEditor();
    `).then(success => {
        if (success !== false) {
            // Update main window title
            const fileName = path.basename(filePath, '.szaarc');
            mainWindow.setTitle(`ScreenPlayzaarc - ${fileName}`);
            console.log('Script file opened successfully:', filePath);
        } else {
            dialog.showErrorBox('Error', 'Failed to load script content into editor.');
        }
    }).catch(error => {
        console.error('Error executing script loading code:', error);
        dialog.showErrorBox('Error', 'Script failed to execute: ' + error.message);
    });
}

// Handle Save As from menu
function handleSaveAs() {
    mainWindow.webContents.executeJavaScript(`
        // Call the renderer process saveScriptAs function
        if (typeof saveScriptAs === 'function') {
            saveScriptAs();
            true; // Return success
        } else {
            console.error('saveScriptAs function not found in renderer');
            false; // Return failure
        }
    `).then(success => {
        if (!success) {
            console.error('Failed to call saveScriptAs from renderer');
            // Fallback to direct save dialog if needed
            saveScriptAs();
        }
    }).catch(error => {
        console.error('Error calling Save As:', error);
        // Fallback to direct save dialog
        saveScriptAs();
    });
}

function saveScriptAs() {
    mainWindow.webContents.executeJavaScript(`
        // Get current script data
        const scriptContent = document.getElementById('scriptEditor').innerHTML;
        const title = scriptWriter.currentScript.title || 'Untitled Script';
        
        const szaarcData = {
            format: 'szaarc',
            version: '1.0.0',
            application: 'ScreenPlayzaarc',
            title: title,
            content: scriptContent,
            created: scriptWriter.currentScript.created ? scriptWriter.currentScript.created.toISOString() : new Date().toISOString(),
            lastModified: new Date().toISOString(),
            wordCount: document.getElementById('wordCount').textContent || '0',
            pageCount: document.getElementById('totalPages').textContent || '1'
        };
        
        // Return the data to main process
        JSON.stringify(szaarcData, null, 2);
    `).then(szaarcContent => {
        const currentTitle = szaarcContent ? JSON.parse(szaarcContent).title : 'Untitled Script';
        
        dialog.showSaveDialog(mainWindow, {
            title: 'Save ScreenPlayzaarc Script',
            defaultPath: `${currentTitle}.szaarc`,
            filters: [
                { name: 'ScreenPlayzaarc Scripts', extensions: ['szaarc'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        }).then(result => {
            if (!result.canceled) {
                fs.writeFile(result.filePath, szaarcContent, 'utf8', (err) => {
                    if (err) {
                        dialog.showErrorBox('Error', 'Could not save file: ' + err.message);
                        return;
                    }
                    
                    // Notify the renderer process that the file was saved
                    mainWindow.webContents.executeJavaScript(`
                        if (scriptWriter && scriptWriter.markAsSaved) {
                            scriptWriter.markAsSaved("${result.filePath.replace(/\\/g, '\\\\')}");
                        }
                        if (typeof updateStatus === 'function') {
                            updateStatus('Script saved successfully!');
                        }
                    `);
                    
                    // Update window title
                    const fileName = path.basename(result.filePath, '.szaarc');
                    mainWindow.setTitle(`ScreenPlayzaarc - ${fileName}`);
                    
                    console.log('Script saved successfully to:', result.filePath);
                });
            }
        });
    }).catch(err => {
        dialog.showErrorBox('Error', 'Could not prepare file content: ' + err.message);
    });
}

function showKeyboardShortcuts() {
    const shortcuts = `
Keyboard Shortcuts:

File Operations:
• Ctrl+N (Cmd+N) - New Script
• Ctrl+O (Cmd+O) - Open Script (.szaarc)
• Ctrl+S (Cmd+S) - Save Script
• Ctrl+Shift+S (Cmd+Shift+S) - Save As (.szaarc)
• Ctrl+E (Cmd+E) - Export as PDF
• Ctrl+Shift+E (Cmd+Shift+E) - Export as DOC

Editing:
• Enter - New line (auto-format)
• Tab - Cycle element types
• Backspace - Delete empty line

Formatting:
• Ctrl+1 (Cmd+1) - Scene Heading
• Ctrl+2 (Cmd+2) - Action
• Ctrl+3 (Cmd+3) - Character
• Ctrl+4 (Cmd+4) - Dialogue
• Ctrl+5 (Cmd+5) - Parenthetical
• Ctrl+6 (Cmd+6) - Transition

Navigation:
• Ctrl+Left (Cmd+Left) - Previous Page
• Ctrl+Right (Cmd+Right) - Next Page

View:
• Ctrl++ (Cmd++) - Zoom In
• Ctrl+- (Cmd+-) - Zoom Out
• Ctrl+0 (Cmd+0) - Reset Zoom
• F12 - Developer Tools
    `;

    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'ScreenPlayzaarc Shortcuts',
        message: 'ScreenPlayzaarc Keyboard Shortcuts',
        detail: shortcuts,
        buttons: ['OK']
    });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle file opening from command line or double-click
app.on('open-file', (event, filePath) => {
    event.preventDefault();
    
    // If no window exists, create one first
    if (!mainWindow) {
        createWindow();
    }
    
    // Wait for window to be ready, then open the file
    if (mainWindow.isDestroyed()) {
        createWindow();
        mainWindow.once('ready-to-show', () => {
            setTimeout(() => openScriptFile(filePath), 1000);
        });
    } else {
        openScriptFile(filePath);
    }
});

// Handle file opening on Windows when app is launched with file argument
const fileArg = process.argv.find(arg => arg.endsWith('.szaarc'));
if (fileArg && fs.existsSync(fileArg)) {
    app.whenReady().then(() => {
        setTimeout(() => openScriptFile(fileArg), 2000);
    });
}

// Helper function to open a specific .szaarc file
function openScriptFile(filePath) {
    if (!fs.existsSync(filePath)) {
        dialog.showErrorBox('Error', 'File not found: ' + filePath);
        return;
    }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            dialog.showErrorBox('Error', 'Could not open file: ' + err.message);
            return;
        }
        
        try {
            const scriptData = JSON.parse(data);
            
            if (scriptData.format !== 'szaarc') {
                throw new Error('Invalid file format. Expected .szaarc format.');
            }
            
            if (!scriptData.content) {
                throw new Error('No script content found in file.');
            }
            
            // Store the script data temporarily in main process
            global.pendingScriptData = scriptData;
            
            // Use the same loading logic as openScript()
            mainWindow.webContents.executeJavaScript(`
                window.location.pathname
            `).then(currentPath => {
                
                if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
                    // Navigate to script page first
                    mainWindow.loadFile('script.html').then(() => {
                        // Wait for page to load, then load script
                        setTimeout(() => {
                            loadScriptIntoEditor(scriptData, filePath);
                        }, 1500);
                    }).catch(error => {
                        console.error('Error loading script page:', error);
                        dialog.showErrorBox('Error', 'Failed to load script editor page.');
                    });
                } else {
                    // Already on script page, load directly
                    loadScriptIntoEditor(scriptData, filePath);
                }
                
            }).catch(error => {
                console.error('Error checking current page:', error);
                dialog.showErrorBox('Error', 'Failed to check current page: ' + error.message);
            });
            
        } catch (parseError) {
            dialog.showErrorBox('Error', 'Invalid .szaarc file format: ' + parseError.message);
        }
    });
}

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});

// Set up IPC handlers for file operations
function setupIpcHandlers() {
    // Handle save file to specific path
    ipcMain.handle('save-file-to-path', async (event, filePath, content) => {
        try {
            await fs.promises.writeFile(filePath, content, 'utf8');
            console.log('File saved successfully to:', filePath);
            return { success: true };
        } catch (error) {
            console.error('Error saving file to path:', error);
            return { success: false, error: error.message };
        }
    });
    
    // Handle save file dialog
    ipcMain.handle('save-file-dialog', async (event, content, defaultName) => {
        try {
            const result = await dialog.showSaveDialog(mainWindow, {
                title: 'Save ScreenPlayzaarc Script',
                defaultPath: `${defaultName}.szaarc`,
                filters: [
                    { name: 'ScreenPlayzaarc Scripts', extensions: ['szaarc'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePath) {
                await fs.promises.writeFile(result.filePath, content, 'utf8');
                
                // Update window title
                const fileName = path.basename(result.filePath, '.szaarc');
                mainWindow.setTitle(`ScreenPlayzaarc - ${fileName}`);
                
                console.log('File saved successfully via dialog to:', result.filePath);
                return { success: true, filePath: result.filePath };
            }
            
            return { success: false, canceled: true };
        } catch (error) {
            console.error('Error in save file dialog:', error);
            return { success: false, error: error.message };
        }
    });
} 