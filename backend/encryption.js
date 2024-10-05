const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const AES_algorithm = 'aes-256-cbc'; // Using AES encryption in CBC Mode
const iv = crypto.randomBytes(16);

/**
 * @brief Generates a hash for the given input using SHA-256 algorithm.
 *
 * @param {string} input - The input string to hash.
 * @return {string} The resulting hash in hexadecimal format.
 */
function generateHash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * @brief Generates a cryptographic value based on a provided hash and another plaintext value (e.g., a number).
 *
 * This function uses HMAC with SHA-256 to combine a hashed password and a plaintext number into a new cryptographic value.
 *
 * @param {string} hash - The hash generated from a password.
 * @param {number|string} plaintext - A plaintext value (usually a number) that will be combined with the hash.
 * @return {string} A cryptographic value generated using HMAC-SHA256.
 *
 * @example
 * const passwordHash = 'a1b2c3d4e5f6g7h8';  // Example hash
 * const plaintext = 12345;
 * const result = generateCryptographicValue(passwordHash, plaintext);
 * console.log(result);  // Outputs cryptographic value
 */
function generateCryptographicValue(hash, plaintext) {
    // Convert plaintext (number) to a string if necessary
    const message = typeof plaintext === 'number' ? plaintext.toString() : plaintext;

    // Create an HMAC object using SHA-256 and the provided hash as the key
    const hmac = crypto.createHmac('sha256', hash);

    // Update the HMAC with the plaintext message
    hmac.update(message);

    // Return the resulting cryptographic value as a hexadecimal string
    return hmac.digest('hex');
}

/**
 * @brief Verifies if the given input matches the provided hash.
 *
 * @param {string} input - The input string to verify.
 * @param {string} hash - The hash to compare against.
 * @return {boolean} True if the input matches the hash, false otherwise.
 */
function verifyHash(input, hash) {
    return generateHash(input) === hash;
}

/**
 * @brief Generates a 32-byte key and saves it to a specified file.
 *
 * @param {string} filePath - The path where the key file will be saved.
 */
function generateKeyToFile(filePath) {
    const key = crypto.randomBytes(32); // Generate a 32-byte key
    fs.writeFileSync(filePath, key); // Write the key to the specified file
    console.log(`Key saved to ${filePath}`);
}

/**
 * @brief Encrypts the given input using AES-256-CBC algorithm.
 *
 * @param {string} input - The input string to encrypt.
 * @return {string} The resulting encrypted string in hexadecimal format.
 */
function encrypt(input, keyPath) {
    // Generate key if it doesn't exist
    if (!fs.existsSync(keyPath)) {
        generateKeyToFile(keyPath);
    }
    const key = fs.readFileSync(keyPath); // Read the key from the file
    let cipher = crypto.createCipheriv(AES_algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @brief Decrypts the given input using AES-256-CBC algorithm.
 *
 * @param {string} encrypted - The encrypted string in hexadecimal format.
 * @return {string} The resulting decrypted string.
 */
function decrypt(encrypted, keyPath) {
    const key = fs.readFileSync(keyPath); // Read the key from the file
    let textParts = encrypted.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(AES_algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    generateHash,
    generateCryptographicValue,
    verifyHash,
    encrypt,
    decrypt
}