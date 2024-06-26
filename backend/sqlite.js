const sqlite3 = require('sqlite3').verbose();
const { DBPath } = require("./config");
const fs = require("fs");
const { generateUniqueRandomNumber } = require("./misc");

// SQL statements to create tables of DB
const db0Tables = [
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
        fName TEXT,
        lName TEXT,
        birth DATE,
        country TEXT,
        gender TEXT,
        account TEXT,
        profile TEXT,
        pass TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS books (
        bookID INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        myRating INTEGER,
        avgRating INTEGER,
        publisher TEXT,
        pagesCount INTEGER,
        pubDate DATE,
        tags TEXT,
        about TEXT,
        coverSrc TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
        name TEXT,
        birth DATE,
        info TEXT,
        profile TEXT,
        path TEXT,
        books TEXT
    );`
];
// TODO: Organize it
/* const Books_Comments = [
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
]; */

// 00. Global database connection
const DB = new sqlite3.Database(DBPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log(`Connected to the ${DBPath} SQLite database.`);
});

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

function createTables(dbPath, tables) {
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
// Creating database
const createToDatabases = async (query) => {
    try {
        await createTables(DBPath, query);
        console.log(`Table [${DBPath}] created successfully.`);
    } catch (error) {
        console.error(error);
    }
};

/**
 * @brief Inserts a new record into a specified table.
 *
 * This function takes an input object containing the table name and the data to be inserted.
 * It constructs an SQL command to insert a new record into the specified table with columns 
 * id, cover, title, review, and tags. After a successful insertion, it logs the row ID of the inserted record.
 *
 * @param INP An object containing the table name and the data to be inserted. The object should have the following structure:
 *            - table: The name of the table into which the record should be inserted.
 *            - Mydata: An array containing the values to be inserted into the table. The order of values in the array should match the columns: [id, cover, title, review, tags].
 *
 * @note The function logs an error message to the console if the insertion fails.
 *       On successful insertion, it logs the row ID of the new record.
 *
 * Example usage:
 * @code
 * const input = {
 *     table: "books",
 *     Mydata: [1, "cover.jpg", "Book Title", "This is a review", "Fiction"]
 * };
 * InsertToMyTable(input);
 * @endcode
 */
function InsertToMyTable(INP) {
    let command = `INSERT INTO ${INP.table} (id, cover, title, review, tags) VALUES (?, ?, ?, ?, ?)`;
    DB.run(command, INP.Mydata, function (err) {
        if (err) {
            return console.error(err.message);
        }
        // Get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
};
/**
 * @brief Inserts a new book record into the books table.
 *
 * This function takes an array of book data and inserts it into the books table
 * in the database. The columns being inserted are bookID, title, author, myRating,
 * avgRating, publisher, pagesCount, pubDate, tags, about, and coverSrc. 
 * After a successful insertion, it logs the row ID of the inserted record.
 *
 * @param data An array containing the values to be inserted into the books table.
 *             The order of values in the array should match the columns in the table:
 *             [bookID, title, author, myRating, avgRating, publisher, pagesCount, pubDate, tags, about, coverSrc].
 *
 * @note The function logs an error message to the console if the insertion fails.
 *       On successful insertion, it logs the row ID of the new record.
 *
 * Example usage:
 * @code
 * const bookData = [1, "Book Title", "Author Name", 5, 4.5, "Publisher Name", 350, "2024-06-20", "Fiction", "This is a book about...", "cover.jpg"];
 * InsertToBooksTable(bookData);
 * @endcode
 */
function InsertToBooksTable(data) {
    DB.run(`INSERT INTO books (bookID, title, author, myRating, avgRating, publisher, pagesCount, pubDate, tags, about, coverSrc) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data, function (err) {
        if (err) {
            return console.error(err.message);
        }
        // Get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
};
/**
 * @brief Reads data from an SQLite database based on the provided query.
 * 
 * This function executes the given SQL query and calls the provided callback with the results.
 *
 * @param {string} query - The SQL query to execute.
 * @param {function} callback - The callback function to call with the results or any errors encountered.
 */
function readFromDatabase(query, callback) {
    DB.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            callback(err, null);
            return;
        }
        callback(null, rows);
    });
}
/**
 * @brief Retrieves records from the database based on the provided query and returns them as a string.
 * 
 * This function calls the readFromDatabase function to execute the given SQL query
 * and returns a promise that resolves to the retrieved rows as a string.
 *
 * @param {string} query - The SQL query to execute.
 * @return {Promise<string>} A promise that resolves to the rows retrieved from the database as a string.
 */
function getRecord(query) {
    return new Promise((resolve, reject) => {
        readFromDatabase(query, (err, rows) => {
            if (err) {
                console.error('Error reading from database:', err);
                reject(err);
            } else {
                resolve(JSON.stringify(rows));
            }
        });
    });
}
// Write to Database
function writeToDatabase(query, params, callback) {
    DB.run(query, params, function (err) {
        if (err) {
            console.error('Error executing query:', err.message);
            callback(err, null);
            return;
        }
        callback(null, { lastID: this.lastID, changes: this.changes });
    });
}
/**
 * @brief Inserts or updates records in the database based on the provided query and parameters.
 * 
 * This function calls the `writeToDatabase` function to execute the given SQL query
 * with the provided parameters and returns a promise that resolves to the result of the query.
 *
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters for the SQL query.
 * @return {Promise<object>} A promise that resolves to the result of the query execution.
 */
function setRecord(query, params) {
    return new Promise((resolve, reject) => {
        writeToDatabase(query, params, (err, result) => {
            if (err) {
                console.error('Error writing to database:', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    db0Tables,
    DB,
    checkDatabaseExists,
    createToDatabases,
    InsertToMyTable,
    InsertToBooksTable,
    getRecord,
    setRecord
};