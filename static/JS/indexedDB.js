// indexedDB.js
let db;

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('iqraaDB', 1);

        request.onupgradeneeded = function (event) {
            db = event.target.result;

            // Create Tables
            if (!db.objectStoreNames.contains('myLibrary')) {
                db.createObjectStore('myLibrary', {keyPath: 'id'});
            }
            /*if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'id' });
            }*/
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            console.error('Error opening database:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

// Set data in a specific object store (table)
function setData(storeName, data) {
    return openDatabase().then(db => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.put(data);

        return new Promise((resolve, reject) => {
            request.onsuccess = function () {
                resolve('Data set successfully in ' + storeName);
            };

            request.onerror = function (event) {
                reject('Error setting data in ' + storeName + ': ' + event.target.errorCode);
            };
        });
    });
}

// Get data from a specific object store (table)
function getData(storeName, id) {
    return openDatabase().then(db => {
        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject('Error retrieving data from ' + storeName + ': ' + event.target.errorCode);
            };
        });
    });
}

// Delete data from a specific object store (table)
function deleteData(storeName, id) {
    return openDatabase().then(db => {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.delete(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = function () {
                resolve(`Data with id ${id} deleted successfully from ${storeName}`);
            };

            request.onerror = function (event) {
                reject(`Error deleting data from ${storeName}: ` + event.target.errorCode);
            };
        });
    });
}

export default {
    setData,
    getData,
    deleteData
}