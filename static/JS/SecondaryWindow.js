// Components
const SecondaryWindow = document.getElementById("SecondaryWindow");
const SecondaryWindowHeader = document.getElementById("SecondaryWindowHeader_");
const SecondaryWindowBody = document.getElementById("SecondaryWindowBody");
const SecondaryWindowBt = document.getElementById("SecondaryWindowBt_");
//-----------------------------------------------
function SecondaryWindowLoad(title, body, bt) {
    SecondaryWindowHeader.innerText = title;
    SecondaryWindowBody.innerHTML = body;
    SecondaryWindowBt.innerText = bt;
};

function showHideSecondaryWindow(title, body, bt) {
    if (SecondaryWindow.getAttribute("data-show") === "show") {
        SecondaryWindow.setAttribute("data-show", "hide");
        SecondaryWindow.style.display = "none";
    } else {
        SecondaryWindow.setAttribute("data-show", "show");
        SecondaryWindow.style.display = "block";
        // TODO: Simplify it
        SecondaryWindow.style.right = (((1 - (SecondaryWindow.offsetWidth / window.innerWidth)) / 2) * window.innerWidth) / 2 + 'px';
        SecondaryWindowLoad(title, body, bt);
    }
};

SecondaryWindowBt.onclick = () => {
    SecondaryWindow.setAttribute("data-show", "hide");
    SecondaryWindow.style.display = "none";
}