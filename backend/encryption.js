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
    verifyHash,
    encrypt,
    decrypt
}