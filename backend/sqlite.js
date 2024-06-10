const sqlite3 = require('sqlite3').verbose();
const { USERDB, BOOKSDB, AUTHORSDB } = require("./config");
const fs = require("fs");
const { generateUniqueRandomNumber } = require("./misc");

// SQL statements to create tables for DB1 ("User Tables")
const db1Tables = [
    `
    CREATE TABLE IF NOT EXISTS read (
        book INTEGER,
        tags TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS want (
        book INTEGER,
        tags TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS notes (
        notes TEXT,
        tags TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS suggest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
        book INTEGER,
        tags TEXT,
    );`
];
// SQL statements to create tables for DB2 ("Books Database")
const db2Tables = [
    `CREATE TABLE IF NOT EXISTS Books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coverSrc TEXT,
    title TEXT,
    pagesCount INTEGER,
    pubDate DATE,
    rating INTEGER,
    author INTEGER,
    about TEXT,
    tags TEXT
  );`
];
// SQL statements to create tables for DB3
const db3Tables = [
    `CREATE TABLE IF NOT EXISTS AUTHOR (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    birth DATE,
    info TEXT,
    profile TEXT,
    path TEXT,
    books TEXT
  );`
];
// SQL statements to create tables for DB3
const db4Tables = [
    `CREATE TABLE IF NOT EXISTS Books_Comments (
    BookId INTEGER,
    Comments TEXT
  );`,
    `CREATE TABLE IF NOT EXISTS Books_Comments_Details (
    UserID INTEGER,
    ThreadID INTEGER,
    UserName TEXT,
    time TIME,
    Comment TEXT
  );`,
    `CREATE TABLE IF NOT EXISTS USER_COMMENT (
    BOOKID INTEGER,
    books TEXT
  );`
];

/**
 * @brief Checks if an SQLite database exists and contains tables.
 * 
 * This function checks if the specified SQLite database file exists on the filesystem.
 * If the file exists, it opens the database and queries the `sqlite_master` table to determine
 * if there are any tables in the database.
 * 
 * @param {string} dbPath The path to the SQLite database file.
 * @return {Promise<boolean>} A promise that resolves to `true` if the database exists and has tables, and `false` otherwise.
 * 
 * @throws {Error} If an error occurs while opening or querying the database.
 * 
 * @example
 * const dbPath = 'example.db';
 * checkDatabaseExists(dbPath)
 *   .then((exists) => {
 *     if (exists) {
 *       console.log("Database exists and has tables.");
 *     } else {
 *       console.log("Database does not exist or has no tables.");
 *     }
 *   })
 *   .catch((error) => {
 *     console.error(error);
 *   });
 */
function checkDatabaseExists(dbPath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dbPath)) {
            resolve(false);
            return;
        }
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(`An error occurred while opening the database: ${err.message}`);
                return;
            }

            db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
                if (err) {
                    reject(`An error occurred while querying the database: ${err.message}`);
                } else {
                    resolve(tables.length > 0);
                }
                db.close();
            });
        });
    });
}
/**
 * @brief Creates an SQLite database file and adds tables to it based on the provided schema.
 * 
 * @param {string} dbPath The path where the SQLite database file should be created.
 * @param {Array<Object>} tables Array of table creation SQL statements.
 * @return {Promise<void>} A promise that resolves when the database and tables are successfully created.
 * 
 * @throws {Error} If an error occurs while creating the database or tables.
 */
function createDatabase(dbPath, tables) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(new Error(`An error occurred while creating the database: ${err.message}`));
                return;
            }
            db.serialize(() => {
                tables.forEach((table) => {
                    db.run(table, (err) => {
                        if (err) {
                            reject(new Error(`An error occurred while creating a table: ${err.message}`));
                            return;
                        }
                    });
                });
            });

            db.close((err) => {
                if (err) {
                    reject(new Error(`An error occurred while closing the database: ${err.message}`));
                } else {
                    resolve();
                }
            });
        });
    });
}
// Creating databases
const createAllDatabases = async () => {
    try {
        await createDatabase(BOOKSDB, db2Tables);
        console.log("Books DB created successfully.");
        await createDatabase(USERDB, db1Tables);
        console.log("User DB created successfully.");
        // await createDatabase('DB3.sqlite', db3Tables);
        // console.log("DB3 created successfully.");
    } catch (error) {
        console.error(error);
    }
};

// Middleware to parse JSON bodies
const bodyParser = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(JSON.parse(body));
    });
};

function SQL(userId, method, command, req, res) {
    if (userId) { //TODO: check if user have permsision
        if (method === "GET") {
            db.all(command, [], (err, rows) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(rows));
                }
            });
        } else if (method === "POST") {
            bodyParser(req, (body) => {
                const { name, email } = body;
                db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ id: this.lastID }));
                    }
                });
            });
        }
    } else {
        console.log("Sorry but you're not allowed");
    }
}

/* Main Database Routine */
// 1. DB1 ("User")
const db1 = new sqlite3.Database(USERDB, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log(`Connected to database [${USERDB}].`);
    }
});
// 2. DB2 ("Books")
const db2 = new sqlite3.Database(BOOKSDB, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log(`Connected to database [${BOOKSDB}].`);
    }
});
// 3. DB3 ("Authors")
const db3 = new sqlite3.Database(AUTHORSDB, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log(`Connected to database [${AUTHORSDB}].`);
    }
});

module.exports = {
    db1,
    db2,
    db3,
    checkDatabaseExists,
    createAllDatabases
};