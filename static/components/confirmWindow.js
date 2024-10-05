export default function confirmWindow(elem, data, approveListener, declineListener) {
    const {title, body, btTrue, btFalse} = data;
    /****
     * Remove Child IF exit
     * */
    if (elem.hasChildNodes()) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
    }
    /***
     * Create New One
     * */
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-center" id="modalLabel">${title}</h5>
            </div>
            <div class="modal-body">
                ${body}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="yesBtn">${btTrue}</button>
                <button type="button" class="btn btn-secondary" id="noBtn" data-bs-dismiss="modal">${btFalse}</button>
            </div>
        </div>
    </div>
</div>
    `;
    elem.append(container);
    /***
     * Assign Functions
     * */
    const yesButton = document.getElementById('yesBtn');
    const noButton = document.getElementById('noBtn');
    /****
     * Approve Listener
     * */
    yesButton.addEventListener('click', () => {
        approveListener();
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        modal.hide();
    });
    /***
     * Decline Listener
     * */
    noButton.addEventListener('click', () => {
        declineListener()
        console.log('Response: No');
    });
}