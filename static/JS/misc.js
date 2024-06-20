/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
function getData(path) {
    let obj = fetch(`http://localhost:1999/${path}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};
/**
 * Sends a POST request to the specified path with the given data.
 * 
 * @param {string} path - The endpoint path where the request will be sent.
 * @param {object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<object>} - A promise that resolves to the response data as JSON.
 */
function postData(path, data) {
    // Send a POST request to the specified path
    let obj = fetch(`http://localhost:1999/${path}`, {
        method: 'POST', // Specify the request method as POST
        headers: {
            "Content-Type": "application/json", // Indicate that the request body is JSON
            "Accept": "application/json" // Indicate that the response should be JSON
        },
        body: JSON.stringify(data) // Convert the data object to a JSON string for the request body
    })
        .then(response => {
            // Check if the response is successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the response body as JSON
            return response.json();
        });
    // Return the promise that resolves to the response data
    return obj;
};

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
        } else {
            const digit = parseInt(char);
            arabicNumber += arabicNumerals[digit];
        }
    }

    return arabicNumber;
}