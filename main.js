//TODO: افتكر حط جلوبال فار يعمل زرار العرض اكتيف زي تريد قرائته
document.getElementById("library").style.height = window.innerHeight - 150 + 'px';
/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
function Retrieve(path) {
    let obj = fetch(`http://0.0.0.0:8080`, {
        //TODO: Set some flags to gurantee Security
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};
