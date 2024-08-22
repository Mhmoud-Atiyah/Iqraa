const ID = getQueryParams().userId; // get ID of User Open The Window
//TODO: Set Ip of your Server
const DOMAIN = "192.168.56.5";
/* Some Default Values */
// Number of Reviews to loaded on book view load
const maximumReviewsPage = 8;
// Number Of Characters for Searching
const MinimumSearchInput = 3;
// List Off Currencies
const currency = {
    "EGP": "ج.م",
    "AED": "د.إ",
    "SAR": "ر.س",
    "KWD": "د.ك",
    "BHD": "د.ب",
    "OMR": "ر.ع",
    "JOD": "د.أ",
    "LBP": "ل.ل",
    "SYP": "ل.س",
    "IQD": "د.ع",
    "MRU": "أ.م"
};

/**
 * @description Main Client Routine To Read Data saved local from server
 *
 * @param {string} path word of data needed
 * @returns object of data
 */
async function getData(path) {
    let obj = fetch(`https://${DOMAIN}/${path}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};

async function loadTheme(themeName) {
    try {
        const response = await fetch(`https://${DOMAIN}/loadStyle/${themeName}`, {
            method: 'GET',
            headers: {
                "Accept": "text/css"
            },
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const cssText = await response.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
    } catch (error) {
        console.error('Error fetching the CSS file:', error);
    }
}

/**
 * Sends a POST request to the specified path with the given data.
 *
 * @param {string} path - The endpoint path where the request will be sent.
 * @param {object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<object>} - A promise that resolves to the response data as JSON.
 */
function postData(path, data) {
    // Send a POST request to the specified path
    return fetch(`https://${DOMAIN}/${path}`, {
        method: 'POST', // Specify the request method as POST
        headers: {
            "Content-Type": "application/json", // Indicate that the request body is JSON
            "Accept": "application/json" // Indicate that the response should be JSON
        },
        body: JSON.stringify(data) // Convert the data object to a JSON string for the request body
    }).then(response => {
        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check the Content-Type of the response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            // If the response Content-Type is JSON, parse and return JSON
            return response.json();
        } else if (contentType && contentType.includes("text/html")) {
            // If the response Content-Type is HTML, handle it as needed (for example, return text content)
            return response.text();
        } else {
            // If the response Content-Type is neither JSON nor HTML, handle the scenario accordingly
            throw new Error("Unexpected response type");
        }
    });
}

// Function to get ID Of User
function getQueryParams() {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const params = {};
    vars.forEach(v => {
        const pair = v.split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    });
    return params;
}

/**
 * Converts a number to its Arabic numeral representation.
 *
 * @param {number} number - The number to convert.
 * @returns {string} The Arabic numeral representation of the number.
 */
function convertToArabicNumeral(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const numberString = number.toString();
    let arabicNumber = '';

    for (let i = 0; i < numberString.length; i++) {
        const char = numberString[i];
        if (char === '.') {
            arabicNumber += ',';
        } else if (char === '-') {
            arabicNumber += '/';
        } else {
            const digit = parseInt(char);
            arabicNumber += arabicNumerals[digit];
        }
    }

    return arabicNumber;
}

// Check if it Browser or Electron
function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

/* Set IPC var Undefined in Browsers Env */
if (!isElectron()) {
    window.IPC = undefined;
}

/* Set User Media Permissions */
/**
 * Enable the microphone of the user.
 * @function enableMicrophone
 * @returns {Promise<MediaStream>} A Promise that resolves with the MediaStream object representing the microphone stream.
 * @throws {Error} If the user denies permission or if the browser does not support getUserMedia.
 */
async function enableMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        return stream;
    } catch (error) {
        throw new Error('Failed to enable microphone: ' + error.message);
    }
}

/**
 * Disable the microphone of the user.
 * @function disableMicrophone
 * @returns {boolean} Returns true if the microphone was successfully disabled, false otherwise.
 */
async function disableMicrophone() {
    try {
        const stream = await getMicrophoneStream();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            return true;
        } else {
            console.error('Failed to disable microphone:', error);
            return false; // Failed to disable microphone
        }
    } catch
        (error) {
        console.error('Failed to disable microphone:', error);
        return false;
    }
}

/**
 * Helper function to get the microphone stream.
 * @function getMicrophoneStream
 * @returns {Promise<MediaStream|null>} A Promise that resolves with the MediaStream object representing the microphone stream, or null if access is denied.
 */
async function getMicrophoneStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        return stream; // Return the obtained MediaStream
    } catch (error) {
        console.error('Error accessing microphone:', error);
        return null; // Return null if access is denied or there's an error
    }
}

/**
 * @brief Enables the camera and starts streaming video.
 * @function enableCamera
 * @returns {Promise<MediaStream>} A promise that resolves to the MediaStream object representing the camera feed.
 */
async function enableCamera() {
    // Check if getUserMedia is supported by the browser
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(stream => {
                /* Check ? Riwaq : Library OCR */
                if (riwaq.myScreen !== null) {
                    riwaq.myScreen.srcObject = stream;
                    riwaq.myScreen.play();
                } else {
                    library.OCRScreen.srcObject = stream;
                    library.OCRScreen.play();
                }
            }).catch(error => {
            console.error('Error accessing the camera:', error);
            throw error;
        });
    } else {
        console.error('getUserMedia is not supported by this browser');
        return Promise.reject(new Error('getUserMedia is not supported by this browser'));
    }
}

/**
 * @brief Disables the camera and stops streaming video.
 * @function disableCamera
 */
function disableCamera() {
    if (riwaq.myScreen.srcObject) {
        var stream = riwaq.myScreen.srcObject;
        var tracks = stream.getTracks();

        tracks.forEach(function (track) {
            track.stop();
        });
        riwaq.myScreen.srcObject = null;
        return true;
    } else {
        return false;
    }
}

/**
 * Asynchronously retrieves the user's current geographical location.
 *
 * This function uses the Geolocation API to obtain the latitude and longitude
 * of the user's device. It returns a Promise that resolves with an object containing
 * latitude and longitude properties if successful, or rejects with an error message.
 *
 * @async
 * @function getUserLocation
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves with the user's location.
 * @throws {Error} Throws an error if the location cannot be obtained.
 */
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    resolve({latitude, longitude});
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            reject(new Error("User denied the request for Geolocation."));
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject(new Error("Location information is unavailable."));
                            break;
                        case error.TIMEOUT:
                            reject(new Error("The request to get user location timed out."));
                            break;
                        case error.UNKNOWN_ERROR:
                            reject(new Error("An unknown error occurred."));
                            break;
                    }
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

export default {
    getData,
    postData,
    loadTheme,
    getQueryParams,
    convertToArabicNumeral,
    isElectron,
    enableMicrophone,
    disableMicrophone,
    getMicrophoneStream,
    enableCamera,
    disableCamera,
    getUserLocation,
    maximumReviewsPage,
    MinimumSearchInput,
    DOMAIN,
    ID,
    currency
}