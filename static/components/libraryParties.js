import showHideSecondaryWindow from "../JS/SecondaryWindow.js";
import misc from "../JS/misc.js"

export default function libraryParties(partyData) {
    let elem = `<div class="mb-2" style="display: flex;flex-direction: column;max-height: 310px;overflow: scroll;">`
    for (let i = 0; i < 1; i++) {
        elem += `
        <div class="partyBox border rounded pt-2 mb-2 ps-2 pe-2 cursorBt">
            <span class="align-items-right fw-bold" aria-expanded="false" style="user-select: none;">
                <a href="https://${misc.DOMAIN}/library?libraryId=${partyData.libraryId}&userId=${partyData.id}"><strong class="me-1 partyName" style="letter-spacing: 1px;word-spacing: 2px;">${partyData.name.slice(0, 20)}</strong></a>
                <small class="partyVisits rounded-circle p-1 text-muted" style="background-color: var(--App-buttonBgColor)">${partyData.visits}</small>
                <img class="profilePic rounded-circle" src="${partyData.cover}">
            </span>
        </div>`;
    }
    elem += `</div>`;
    showHideSecondaryWindow("أعضاء المكتبة", elem, "تم");
}