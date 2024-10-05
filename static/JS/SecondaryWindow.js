const SecondaryWindow = document.getElementById("SecondaryWindow");
const SecondaryWindowHeader = document.getElementById("SecondaryWindowHeader_");
const SecondaryWindowClose = document.getElementById("SecondaryWindowHeader_close");
const SecondaryWindowBody = document.getElementById("SecondaryWindowBody");
const SecondaryWindowBt = document.getElementById("SecondaryWindowBt_");
/***
 * Hidden on load
 * */
SecondaryWindow.setAttribute("data-show", "hide");
SecondaryWindow.style.display = "none";

/***
 * Help Function
 * */
function SecondaryWindowLoad(title, body, bt) {
    SecondaryWindowHeader.innerText = title;
    SecondaryWindowBody.innerHTML = body;
    SecondaryWindowBt.innerText = bt;
}

/****
 * Main Routine
 * */
export default function showHideSecondaryWindow(title, body, bt, btType = null) {
    if (SecondaryWindow.getAttribute("data-show") === "show") {
        SecondaryWindow.setAttribute("data-show", "hide");
        SecondaryWindow.style.display = "none";
        document.body.style.overflow = 'scroll'
    } else {
        SecondaryWindowLoad(title, body, bt);
        SecondaryWindow.setAttribute("data-show", "show");
        SecondaryWindow.style.display = "block";
        SecondaryWindow.style.right = ((window.innerWidth - SecondaryWindow.offsetWidth) / 2) + 'px';
        if (btType === 'warning') {
            SecondaryWindowBt.style.backgroundColor = 'var(--App-lightRedColor)'
        } else if (btType === 'normal') {
            SecondaryWindowBt.style.backgroundColor = 'var(--App-panelBorderColor)';
        } else if (btType === 'success') {
            SecondaryWindowBt.style.backgroundColor = 'var(--App-starsColor)';
        }
        document.body.style.overflow = 'hidden';
        mainView.style.filter = 'blur(5px)'
    }
}
/***
 * Close-Window Button
 * */
SecondaryWindowClose.onclick = () => {
    SecondaryWindow.setAttribute("data-show", "hide");
    SecondaryWindow.style.display = "none";
    document.body.style.overflow = 'scroll'
    mainView.style.filter = 'blur(0)'

}
/***
 * Confirm Butoon
 * */
SecondaryWindowBt.onclick = () => {
    SecondaryWindow.setAttribute("data-show", "hide");
    SecondaryWindow.style.display = "none";
    document.body.style.overflow = 'scroll'
    mainView.style.filter = 'blur(0)'
}
/***
 * Out-Of-Focus
 * */
mainView.onclick = () => {
    SecondaryWindow.setAttribute("data-show", "hide");
    SecondaryWindow.style.display = "none";
    document.body.style.overflow = 'scroll'
    mainView.style.filter = 'blur(0)'
}