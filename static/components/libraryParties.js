import showHideSecondaryWindow from "../JS/SecondaryWindow.js";
import misc from "../JS/misc.js"

export default function libraryParties(partyData_) {
    let elem = `<div class="mb-2" style="display: flex;flex-direction: column;max-height: 310px;overflow: scroll;">`
    for (let i = 0; i < partyData_.length; i++) {
        const partyData = partyData_[i];
        elem += `
        <div class="partyBox rounded pt-2 mb-2 ps-2 pe-2 cursorBt" dir="ltr">
            <a href="/user?userId=${partyData.id}" class="fw-bold" aria-expanded="false">
                <small class="partyVisits rounded-2 p-1 pt-2" style="background-color: var(--App-inputBorderColor)">${partyData.visits}</small>
                <span class="float-end ms-2">
                    <strong class="me-1 partyName" style="letter-spacing: 1px;word-spacing: 2px;">${partyData.name.slice(0, 20)}</strong>
                    <img class="profilePic rounded-circle" src="${partyData.cover}">
                </span>
            </a>
        </div>`;
    }
    elem += `</div>`;
    showHideSecondaryWindow("أعضاء المكتبة", elem, "تم");
}