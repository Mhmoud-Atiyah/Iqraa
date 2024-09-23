function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export default function AddToMyBooks(tags) {
    let tagsStr = ""
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<div class="bookshelfBt rounded btn mb-2 ms-2">${tags[i]}</div>`;
    }
    return `
<form id="addBookModal" style="user-select: none;margin-top: 10px;width: 400px">
    <!-- Date Of Start/End -->
    <div class="row">
        <div class="col mb-2">
        <div class="row">
            <label class="col-2" style="height: 20px; font-family: Moharram, serif;font-size: 28px;position:relative;top: -4px">من</label>
            <input type="text" id="addBookModal_dateRead_from" class="col form-control me-2" required placeholder="${formatDate(new Date())}" 
                    max="${formatDate(new Date())}" min="2000-01-01" onfocus="(this.type='date')" onblur="(this.type='text')" style="font-family: NumberFont, serif;">
        </div>   
        </div>
        <div class="col mb-2">
            <div class="row">
                <label class="col-2" style="height: 20px; font-family: Moharram, serif;font-size: 28px;position:relative;top: -4px;right: -5px">إلى</label>
                <input type="text" id="addBookModal_dateRead_to" class="col form-control me-2" required placeholder="${formatDate(new Date())}" 
                    max="${formatDate(new Date())}" min="2000-01-01" onfocus="(this.type='date')" onblur="(this.type='text')" style="font-family: NumberFont, serif;">
            </div>
        </div>
    </div>
    <!-- Book Rate -->
    <div class="row">
        <div class="col mb-2">
            <div  id="addBookModal_rate" class="rating me-2 rounded ps-2 pe-2" style="direction: ltr;flex: 1 1 auto;box-sizing: border-box;">
                <input type="radio" class="ratingBt" name="rating" id="star1" value="1"><label for="star1">&#9733;</label>
                <input type="radio" class="ratingBt" name="rating" id="star2" value="2"><label for="star3">&#9733;</label>
                <input type="radio" class="ratingBt" name="rating" id="star3" value="3"><label for="star2">&#9733;</label>
                <input type="radio" class="ratingBt" name="rating" id="star4" value="4"><label for="star4">&#9733;</label>
                <input type="radio" class="ratingBt" name="rating" id="star5" value="5"><label for="star5">&#9733;</label>
            </div>
        </div>
    </div>
    <!-- User Tags -->
    <div id="addBookModal_bookshelves">
        <div class="container mt-2">
            <div class="button-container pe-3">
                ${tagsStr}
            </div>
        </div>
    </div>
    <!-- User Review -->
    <div id="addBookModal_comment">
     <textarea id="myBookComment" class="form-control pt-2 pb-2 mb-2" rows="4" placeholder="مراجعة الكتاب"></textarea>
  </div>
</form>
`;
}