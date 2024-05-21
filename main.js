const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');
const misc = require('./misc');
// const { createSign } = require('crypto');

// Some Defualt Values

const ASSETSPATH = path.join(__dirname, "/assets");
const DATAPATH = path.join(__dirname, "/data");
const PORT = process.env.PORT || 1999;
//---------------------------------------------------------
// Helpful Functions
//---------------------------------------------------------
// True if it's first time
function isItfirstTime(path) {
    if (!fs.existsSync(path)) {
        return true;
    } else {
        false;
    }
};
/**
 * @brief Reads a file asynchronously.
 * @param {string} filename - The path of the file to read.
 * @returns {Promise<Buffer|string>} A promise that resolves with the file data as a Buffer or string, depending on the encoding used.
 */
fs.readFileAsync = function (filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};
/**
 * Converts a hyphen-separated string of favorite items into a JSON array string.
 * 
 * @param {string} list - The hyphen-separated string of favorite items.
 * @returns {string} A JSON array string containing the favorite items.
 * 
 * @example
 * const list = "item1-item2-item3";
 * const result = favouriteSave(list);
 * console.log(result); // Output: '["item1", "item2", "item3"]'
 */
function favouriteSave(list) {
    let str = '[';
    const arr = list.split("-");
    arr[0] = arr[0].slice(4);
    // Iterate over the array of items
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        str += `"${element}"`;
        // Add a comma if it's not the last item
        if (index != arr.length - 1) {
            str += ',';
        }
    }
    str += ']';
    // Return the JSON array string
    return str;
};
/**
 * @brief Opens a new tab in Google Chrome with the specified URL.
 *
 * This function opens a new tab in Google Chrome with the specified URL.
 * It uses the `google-chrome` command to execute the operation.
 *
 * @param {string} url - The URL of the webpage to open in the new tab.
 * @returns {void}
 *
 * @note This function requires Google Chrome to be installed and accessible via the `google-chrome` command.
 * @note If an error occurs while opening the tab, an error message will be logged to the console.
 * @note This function is asynchronous, and the success or failure of the operation is determined by the callback.
 *
 */
function ChromeTabOpen(url) {
    exec(`google-chrome ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening Google Chrome: ${error}`);
            return;
        }
        console.log(`Google Chrome opened ${url} successfully`);
    });
}
//---------------------------------------------------------
// JSON related Functions
//---------------------------------------------------------
/**
* Reads a JSON file and sends its contents as a response in an HTTP server.
*
* @param {string} file - The path to the JSON file to be read.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
*/
function readJson(file, req, res) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err;
        let Data = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(Data));
        res.end();
    });
}
/**
 * Edits a JSON file by either deleting a specified key data or editing existing data.
 *
 * @param {string} path - The path to the JSON file.
 * @param {number} opt - The option for editing the JSON data. 
 * Use 0 to delete data with a string key, 
 * or 1 to edit data with an object, 
 * or 2 to append data to object.
 * @param {string|object} data - The data to be deleted, edited or append . 
 * If `opt` is 0, it should be a string representing the key to be deleted.
 * If `opt` is 1, it should be an object containing the key-value pairs to be edited.
 * If `opt` is 2, it should be an object containing the key-value pairs to be appended
 * @returns {void}
 */
function editJsonFile(path, opt, data) {
    fs.readFileAsync(path).then((seed) => {
        let Input = JSON.parse(seed);
        // Delete Specified Key Data
        if (opt === 0 && typeof data === 'string') {
            if (Input.hasOwnProperty(`${data}`)) {
                delete Input[`${data}`]
            }
        } else if (opt === 1 && typeof data === 'object') {
            // Edit Data
            Object.keys(data).forEach((key) => {
                Input[key] = data[key];
            })
        } else if (opt === 2 && typeof data === 'object') {
            // append Data
            Input.push(data);
        } else {
            // Error Option
            console.log("Invalid option. Use 0 with a string or 1 with an object.");
            return;
        }
        // Write it back
        fs.writeFile(path, JSON.stringify(Input), 'utf8', (err) => {
            if (err) throw err;
            console.log(`Data of file:${path} updated successfully`);
        });
    });
}
//---------------------------------------------------------
// Windows Creating Routines
//---------------------------------------------------------
/** Login Modal **/
function createLoginWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1280,
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true // Enable nodeIntegration
        }

    })
    win.loadFile("static/login.html");
}
/** Main Window **/
function createMainWindow(id) {
    const win = new BrowserWindow({
        minHeight: 600,
        minWidth: 1024,
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadURL(`file://${path.join(__dirname, 'static/main.html')}?userId=${id}`);
};
/** Book View Window **/
function createBookWindow(bookId) {
    const win = new BrowserWindow({
        height: 690,
        width: 1024,
        // minHeight: 720,
        // minWidth: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false
        }
    })
    win.loadURL(`file://${path.join(__dirname, 'static/bookView.html')}?bookId=${bookId}`);
}
/** Riwaq Window **/
function createRiwaqWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 720,
        width: 720,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadFile('static/riwaq.html');
};
/** Notes Window **/
function createNotesWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 720,
        width: 720,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadFile('static/notes.html');
};
/** Settings Window **/
function createSettingsWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 720,
        width: 720,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadFile('static/settings.html');
};
/** Register New User **/
function createsignUpWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1280,
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadFile('static/signUp.html');
};
//---------------------------------------------------------
// Main Routines
//---------------------------------------------------------
// Main Backend Server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'static/main.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(content);
            }
        });
    } else if (req.url.includes('login')) { // Login Window
        /* First 
            Get credentials
         */
        const credentials = req.url.split('/login/')[1];
        //TODO: Add Decryption
        const Credentials = decodeURIComponent(credentials);
        const [userName, passWord] = Credentials.split('|');
        /* Second
            Retrieve file of user localy OR test on internet one (Future!)
        */
        fs.readFile(`${DATAPATH}/users.json`, 'utf-8', (err, content) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            try {
                const Users = JSON.parse(content);
                for (const user of Users) {
                    if (user.userName == userName && user.passWord == passWord) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(user.id));
                        res.end();
                        return;
                    };
                };
                //Error! The User not exist
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(""));
                res.end();

            } catch (parseErr) {
                console.error(`Error parsing JSON File (${DATAPATH}/users.json):`, parseErr);
            }
        });
    } else if (req.url.includes('Config')) { // Login Window
        readJson(`${DATAPATH}/config.json`, req, res);
    } else if (req.url.includes('userData')) { // Load User Data
        /* First 
            Get User ID
         */
        const ID = req.url.split('/userData/')[1];
        readJson(`${DATAPATH}/${ID}/${ID}_data.json`, req, res);
    } else if (req.url.includes('loadBookData')) { // Load User Data
        /* Get Book ID */
        const ID = req.url.split('/loadBookData/')[1];
        readJson(`${DATAPATH}/books/${ID}.json`, req, res);
    } else if (req.url.includes('signUp')) { // signUp Window
        /* 
            Just one time load data for sign up
        */
        fs.readFile(`${ASSETSPATH}/signUp.json`, 'utf-8', (err, content) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            const signUpData = JSON.parse(content);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(signUpData));
            res.end();
        });
    } else if (req.url.includes('createUser')) { // Save User to File
        const user_Data = req.url.split('/createUser/')[1];
        //TODO: Add Decryption
        const UserData = decodeURIComponent(user_Data);
        let [
            id,
            firstName,
            lasttName,
            age,
            Country,
            gender,
            account,
            profile,
            password,
            about,
            favouriteBooks,
            interests
        ] = UserData.split('|');
        /*
            Create Dir with ID to contain user data and Caches
        */
        fs.mkdir(`${DATAPATH}/${id.slice(4)}`, (err) => {
            if (err) throw err;
            console.log(`Directory: ${DATAPATH}/${id} created successfully`);
            /* Save Main Data To File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}.json`, `
        {
            "id": "${id.slice(4)}",
            "firstName": "${firstName.slice(4)}",
            "lasttName": "${lasttName.slice(4)}",
            "age": "${age.slice(4)}",
            "Country": "${Country.slice(4)}",
            "gender": "${gender.slice(4)}",
            "account": "${account.slice(4)}",
            "profile": "${profile.slice(4)}",
            "password": "${password.slice(4)}",
            "about": "${about.slice(4)}",
            "favouriteBooks": ${favouriteSave(favouriteBooks)},
            "interests": ${favouriteSave(interests)}
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)} Registerd with ID: ${id.slice(4)}`);
                }
            });
            /* Save Minor Data To File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_data.json`, `
        {
            "id": "${id.slice(4)}",
            "firstName": "${firstName.slice(4)}",
            "lasttName": "${lasttName.slice(4)}",
            "account": "${account.slice(4)}",
            "profile": "${profile.slice(4)}",
            "current": {
                "id": "",
                "cover": "https://m.media-amazon.com/images/I/81QPHl7zgbL._AC_UF1000,1000_QL80_.jpg",
                "title": "اختر كتاب تقراءه حالياَ",
                "path": ""
            },
            "lastSearch": [],
            "read": "${id.slice(4)}_read.json",
            "want": "${id.slice(4)}_want.json",
            "notes": "${id.slice(4)}_notes.json"
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Minor Data Created`);
                }
            });
            /* Create Read File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_read.json`, `
        {
            "id": "${id.slice(4)}",
            "books": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Read Books Created`);
                }
            });
            /* Create Want File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_want.json`, `
        {
            "id": "${id.slice(4)}",
            "books": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Read Books Created`);
                }
            });
            /* Create notes File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_notes.json`, `
        {
            "id": "${id.slice(4)}",
            "notes": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s notes Created`);
                }
            });
            /*  Add User Entry in Users.json */
            editJsonFile(`${DATAPATH}/users.json`, 2, {
                "id": id.slice(4),
                "userName": account.slice(4),
                "passWord": password.slice(4)
            });
        });
        /*
        Re-open Login Window again
        */
        createLoginWindow();
    } else {
        // Handle other requests (if any)
        res.writeHead(404);
        res.end('Not Found');
    }
});

/**
 * First Check If Files and DIRs Exist ?
 */

/**
 * Second Start Backend Server
 */
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.whenReady().then(() => {
    if (isItfirstTime(DATAPATH)) {
        /* Create Main Dirs */
        fs.mkdir(`${DATAPATH}`, (err) => {
            if (err) throw err;
            console.log(`Directory: ${DATAPATH} created successfully`);
            fs.mkdir(`${DATAPATH}/books`, (err) => {
                if (err) throw err;
                console.log(`Directory: ${DATAPATH}/books created successfully`);
            });
        });
        // Check Connection
        var isOnline = false;
        (async () => {
            const online = await checkOnline();
            if (online) {
                isOnline = true;
            } else {
                isOnline = false;
            }
        })();
        /* Create Config File */
        fs.writeFile(`${DATAPATH}/config.json`, `
        {
            "connection": ${isOnline},
            "dark": false,
            "dock": "show",
            "theme": [
                "bg-primary",
                "bg-success",
                "bg-danger",
                "bg-warning"
            ]
        }
        `, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log(`Successfully Config File Created`);
            }
        });
        /* Create Users File */
        fs.writeFile(`${DATAPATH}/users.json`, `[]`, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log(`Successfully Users File Created`);
            }
        });
    };
    createLoginWindow();
    ipcMain.on('open-main-window', (event, data) => {
        createMainWindow(data);
    });
    ipcMain.on('open-signUp-window', () => {
        createsignUpWindow();
    });
    ipcMain.on('open-book-window', (event, data) => {
        createBookWindow(data);
    });
    ipcMain.on('open-settings-window', () => {
        createSettingsWindow();
    });
    ipcMain.on('open-Notes-window', () => {
        createNotesWindow();
    });
    ipcMain.on('open-riwaq-window', () => {
        createRiwaqWindow();
    });

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})