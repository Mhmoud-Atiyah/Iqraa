// Components
const SecondaryWindow = document.getElementById("SecondaryWindow");
const SecondaryWindowHeader = document.getElementById("SecondaryWindowHeader_");
const SecondaryWindowBody = document.getElementById("SecondaryWindowBody");
const SecondaryWindowBt = document.getElementById("SecondaryWindowBt_");
//-----------------------------------------------
/* Set It hidden on load */
SecondaryWindow.setAttribute("data-show", "hide");
SecondaryWindow.style.display = "none";

function SecondaryWindowLoad(title, body, bt) {
    SecondaryWindowHeader.innerText = title;
    SecondaryWindowBody.innerHTML = body;
    SecondaryWindowBt.innerText = bt;
}

export default function showHideSecondaryWindow(title, body, bt) {
    if (SecondaryWindow.getAttribute("data-show") === "show") {
        SecondaryWindow.setAttribute("data-show", "hide");
        SecondaryWindow.style.display = "none";
    } else {
        SecondaryWindowLoad(title, body, bt);
        SecondaryWindow.setAttribute("data-show", "show");
        SecondaryWindow.style.display = "block";
        SecondaryWindow.style.right = ((window.innerWidth - SecondaryWindow.offsetWidth) / 2) + 'px';
    }
}

SecondaryWindowBt.onclick = () => {
    SecondaryWindow.setAttribute("data-show", "hide");
    SecondaryWindow.style.display = "none";
}