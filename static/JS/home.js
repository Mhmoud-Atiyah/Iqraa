import misc from "./misc.js"
import showHideSecondaryWindow from './SecondaryWindow.js';

/**********************
 * Main Routine On start
 * ********************/
window.onload = () => {
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
    /***
     * Iqraa User
     * */
    if (misc.ID !== null) {
        misc.getData(`loadConfig/${misc.ID}`).then((config) => {
            /*****
             * Load Effect
             * ****/
            document.getElementsByClassName('loader')[0].remove();
            mainView.style.filter = "blur(0)";
        })
    }
    /***
     * Internet User
     * */
    else {
        // TODO: Create Iqraa Home Welcome Window
    }
}