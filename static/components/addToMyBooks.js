//TODO: Get it from json File based on book type
const starsInfo = [
    "حبكة مثيرة ومترابطة تجذب القارئ",
    "شخصيات معقدة تنمو وتتطور على مدار القصة",
    "لغة واضحة وجذابة تناسب الموضوع",
    "توازن جيد في تقدم الأحداث يبقي القارئ مهتمًا",
    "مواضيع عميقة ومثيرة للتفكير مع القراء",
    "القدرة على إثارة مشاعر قوية لدى القارئ",
    "تفاصيل غنية وعالم مُصمم بشكل جيد (خاصة في الخيال)",
    "محادثات طبيعية تعكس شخصيات القصة",
    "صراعات مهمة تدفع القصة للأمام",
    "نهاية مُرضية ومرتبطة بأحداث الكتاب"
];

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export default function AddToMyBooks(tags) {
    let tagsStr = "";
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<div class="bookshelfBt rounded btn mb-2 ms-2">${tags[i]}</div>`;
    }
    return `
<form id="addBookModal" class="p-3 pt-0" style="user-select: none;width: 400px">
<!-- Book Rate -->
    <div class="row mb-2">
        <span class="col-2 pt-2" style="font-family: Monadi, serif">التقييم</span>
        <div class="col pt-1">
            <div  id="addBookModal_rate" class="rating rounded ps-1 pe-1 fs-4">
                <span class="ratingBt cursorBt me-1" data-traits="1">&#9733;
                    <span class="info-box">${starsInfo[0]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="2">&#9733;
                    <span class="info-box">${starsInfo[1]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="3">&#9733;
                    <span class="info-box">${starsInfo[2]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="4">&#9733;
                    <span class="info-box">${starsInfo[3]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="5">&#9733;
                    <span class="info-box">${starsInfo[4]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="6">&#9733;
                    <span class="info-box">${starsInfo[5]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="7">&#9733;
                    <span class="info-box">${starsInfo[6]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="8">&#9733;
                    <span class="info-box">${starsInfo[7]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="9">&#9733;
                    <span class="info-box">${starsInfo[8]}</span>
                </span>
                <span class="ratingBt cursorBt me-1" data-traits="10">&#9733;
                    <span class="info-box">${starsInfo[9]}</span>
                </span>
            </div>
        </div>
    </div>
    <!-- User Review -->
    <div class="row" id="addBookModal_comment">
     <textarea id="myBookComment" class="form-control pt-2 pb-2 mb-2" rows="4" placeholder="مراجعة الكتاب"></textarea>
    </div>
    <!-- Date Of Start/End -->
    <div class="row mt-2 mb-2">
            <input type="text" id="addBookModal_dateRead_from" class="col form-control me-2" required placeholder="حدد تاريخ البداية" 
                    max="${formatDate(new Date())}" min="2000-01-01" onfocus="(this.type='date')" onblur="(this.type='text')" style="font-family: NumberFont, serif;">
            <span class="col-1 pt-2 fs-5 ms-2"><i class="fa-solid fa-arrow-alt-circle-left"></i></span>
            <input type="text" id="addBookModal_dateRead_to" class="col form-control me-2" required placeholder="حدد تاريخ النهاية" 
                    max="${formatDate(new Date())}" min="2000-01-01" onfocus="(this.type='date')" onblur="(this.type='text')" style="font-family: NumberFont, serif;">
    </div>    
    <!-- User Tags -->
    <div class="row" id="addBookModal_bookshelves">
        <div class="container mt-2">
            <div class="button-container pe-3">
                ${tagsStr}
            </div>
        </div>
    </div>
</form>
`;
}