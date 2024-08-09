const {DBPath} = require("./config");
//TODO: Set Ip of your Server
const DOMAIN = "localhost";
const {Pool} = require('pg');

const pool = new Pool({
    user: 'mhmoud',
    host: `${DOMAIN}`,
    database: 'iqraa',
    password: 'dreams',
    port: 5432,
});

/**
 * @function createTable
 * @description Creates a table in the PostgreSQL database.
 * @param {string} tableName - The name of the table to be created.
 * @param {string} columns - The SQL definition for the columns of the table.
 * @returns {Promise<void>} A promise that resolves when the table is created.
 * @throws {Error} Throws an error if the table creation fails.
 *
 * @example
 * createTable('users', 'id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100)')
 *   .then(() => console.log('Table created successfully'))
 *   .catch(err => console.error('Error creating table:', err));
 */
async function createTable(tableName, columns) {
    // Construct the SQL query to create the table
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}
                   (
                       ${columns}
                   );`;

    try {
        const result = await pool.query(query);
        // Construct the SQL query to create the table
        console.log(`Table ${tableName} created successfully.`);
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;  // Re-throw the error for the caller to handle
    }
}

// Connect to the database
/**
 * Inserts data into a specified PostgreSQL table.
 *
 * @param {string} tableName - The name of the table where data will be inserted.
 * @param {Object} data - An object representing the data to be inserted.
 * @returns {Promise<void>} - A promise that resolves when the data is successfully inserted.
 *
 * @throws {Error} - Throws an error if the insertion fails.
 *
 * @example
 * const tableName = 'users';
 * const data = { name: 'John Doe', email: 'john.doe@example.com' };
 *
 * insertData(tableName, data)
 *     .then(() => console.log('Data inserted successfully'))
 *     .catch(err => console.error('Error inserting data:', err));
 */
async function insertData(tableName, data) {
    try {
        // Build the query dynamically
        const keys = Object.keys(data);
        const values = Object.values(data);

        const query = `
            INSERT INTO ${tableName} (${keys.join(', ')})
            VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')})
        `;
        const result = await pool.query(query, values);
        console.log(`Data Added to [TABLE: ${tableName}] successfully:`, result.rowCount);
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw new Error('Failed to insert data');
    }
}

/**
 * @brief Checks if a user with the given ID and password exists in the 'users' table, and retrieves the user's ID.
 *
 * @param userAccount
 * @param {string} userPassword - The password of the user to check.
 * @returns {Promise<string|null>} - Returns a promise that resolves to the user's ID if the credentials are valid, or null if the credentials are invalid.
 *
 * @throws {Error} - Throws an error if there is a problem with the database query.
 */
async function checkUserCredentials(userAccount, userPassword) {
    const query = `
        SELECT id
        FROM users
        WHERE account = $1
          AND pass = $2;
    `;
    try {
        const result = await pool.query(query, [userAccount, userPassword]);

        // Check if any row was returned and return the ID if found
        return result.rows.length > 0 ? result.rows[0].id : null;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error checking user credentials');
    }
}

/**
 * @function checkIfIdExists
 * @description Checks if a given ID exists in the specified PostgreSQL table.
 * @param {string} tableName - The name of the table to check.
 * @param {number|string} id - The ID to check for existence.
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the ID exists, otherwise `false`.
 * @throws {Error} - Throws an error if there is an issue with the query or database connection.
 */
async function checkIfIdExists(tableName, id) {
    try {
        // Ensure tableName is a valid identifier (you might want to validate or sanitize it)
        const query = `
            SELECT EXISTS (SELECT 1
                           FROM ${tableName}
                           WHERE id = $1);
        `;

        // Execute the query
        const result = await pool.query(query, [id]);

        // Extract the boolean value indicating existence
        return result.rows[0].exists;
    } catch (error) {
        // Handle errors (e.g., log or rethrow)
        console.error('Error checking ID existence:', error);
        throw error;
    }
}

/**
 * @function updateRecord
 * @brief Updates a specified column for a user record in the PostgreSQL database.
 *
 * This asynchronous function updates the value of a specified column in the `users` table
 * for a record where the user's ID matches the given `userID`. The column to be updated is
 * dynamically specified by the `column` parameter.
 *
 * @param {string} tableName - Table to edit
 * @param {number} recordID - The ID of the user whose record needs to be updated.
 * @param {string} column - The name of the column to be updated.
 * @param {string|number|array} newValue - The new value to set for the specified column. This can be of type string or number,
 *                                    depending on the data type of the column.
 *
 * @async
 * @throws {Error} Throws an error if the update operation fails. The error includes details of the failure.
 *
 * @example
 * const userID = 123;
 * const column = 'email';
 * const newValue = 'newemail@example.com';
 *
 * updateUserData(userID, column, newValue)
 *   .then(() => console.log('Update successful'))
 *   .catch(err => console.error('Update failed', err));
 */
async function updateRecord(tableName, recordID, column, newValue) {
    // Define the SQL query with parameters
    const query = `
        UPDATE ${tableName}
        SET ${column} = $1
        WHERE id = $2
    `;
    try {
        const result = await pool.query(query, [newValue, recordID]);
        console.log(`Record [ID: ${recordID}] Data [Entry: ${column}] updated with [Data: ${newValue}] successfully:`, result.rowCount);
    } catch (err) {
        console.error('Error updating record:', err.stack);
        throw err;  // Re-throw the error to be handled by the caller
    }
}

/**
 * @brief Retrieves a record by id from the 'Table' table.
 *
 * @param {string} table - The Table to retrieve.
 * @param {number} recordID - The username of the user to retrieve.
 * @returns {Promise<object|null>} - Returns a promise that resolves to the user record if found, or null if not found.
 *
 * @throws {Error} - Throws an error if there is a problem with the database query.
 */
async function getRecord(table, recordID) {
    const query = `
        SELECT *
        FROM ${table}
        WHERE id = $1;
    `;
    try {
        const result = await pool.query(query, [recordID]);
        // Check if any row was returned and return the first row if found
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error('Error retrieving user record');
    }
}

/**
 * Retrieves book data for a specified user from the database.
 *
 * @param {number} userID - The ID of the user whose book details are to be retrieved.
 * @param {string} section - Which section to load
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects, each containing `bookId`, `title`, and `bookCover`.
 * @throws {Error} - Throws an error if the user ID is not found in the `user_${userID}` table or if the book ID is not found in the `books` table.
 */
async function loadMainView(userID, section) {
    try {
        // Construct the dynamic table name
        const tableName = `user_${userID}`;

        // Step 1: Query the dynamic table to get book IDs for the specified user ID
        const myBooksIDs = await pool.query(`SELECT id
                                             FROM ${tableName}
                                             where bookshelf = '${section}'`);
        if (myBooksIDs.rows.length === 0) {
            throw new Error('ID not found in user_${userID} table');
        }

        // Extract book IDs from the query result
        const bookIds = myBooksIDs.rows.map(row => row.id);

        // Step 2: Query `books` table for details of each book ID
        const bookDetailsPromises = bookIds.map(bookId =>
            pool.query('SELECT title, coversrc FROM books WHERE id = $1', [bookId])
        );

        // Await all the queries
        const bookResults = await Promise.all(bookDetailsPromises);

        // Combine results into a single array
        const bookData = bookResults.map((result, index) => {
            if (result.rows.length === 0) {
                throw new Error(`ID ${bookIds[index]} not found in books table`);
            }
            const {title, coversrc: bookCover} = result.rows[0];
            return {bookId: bookIds[index], title, bookCover};
        });

        return bookData;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

/**
 * @brief Search for a book by name in the database and retrieve its details.
 *
 * @param {string} bookName - The name of the book to search for.
 * @returns {Promise<object|null>} A Promise that resolves with an object containing id, cover, and author_id if the book exists, or null if not found.
 * @throws {Error} Throws an error if there's an issue with the database query.
 */
async function searchBooks(bookName) {
    try {

        // Query to search for the book by name and retrieve id, title, coversrc and authorid
        const query = 'SELECT id, title, coversrc, authorid FROM books WHERE title ILIKE $1';
        // Execute the query
        const result = await pool.query(query, ['%' + bookName + '%']);
        // Return the first result row if found, or null if no book found
        return result.rows.length > 0 ? result.rows : null;
    } catch (err) {
        // Handle errors
        throw new Error(`Error searching for book '${bookName}': ${err.message}`);
    }
}

// Export the client
module.exports = {
    pool,
    insertData,
    createTable,
    getRecord,
    checkUserCredentials,
    checkIfIdExists,
    updateRecord,
    loadMainView,
    searchBooks
};