import misc from "../JS/misc.js";
import showHideSecondaryWindow from '../JS/SecondaryWindow.js';

export default function libraryResource(mainUUID) {
    showHideSecondaryWindow("حدد مصادر بيانات المكتبة", `
            <div class="loader" style="position: absolute;top: 42%;right: 40%;display: none"></div>
            <div class="librarySourceView">
                <!-- Excel -->
                <div class="form-check mt-1 border rounded mb-2" style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;width: 300px;user-select: none">                
                <label class="form-check-label me-3" for="flexSwitchCheckChecked">تحميل مِلَفّ البيانات&nbsp;</label>
                <a class="fs-5" href="https://github.com/Mhmoud-Atiyah/iqraa/blob/master/DOC/goodreads.md" target="_blank" 
                        title="شرح كيفية تحميل الملف والصيغة المطلوبة" style="text-decoration: underline">(الطريقة)</a>
                <a class="fw-bold border rounded cursorBt" href="#" id="browse_excelFileBt">
                        <input class="form-control-file" type="file" name="file" style="display:none" id="browse_excelFile" accept=".xls,.xlsx">
                        <button type="submit" id="browse_excelFile_submit" style="display: none"></button>
                        اختر ملف<i class="fa-solid fa-file-excel fs-6 ms-1 me-2"></i>
                    </a>
            </div>
                <!-- OCR -->
                <div class="form-check mt-1 border rounded mb-2" 
                    style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;user-select: none">
                    <label class="form-check-label me-3" for="flexSwitchCheckChecked">البحث بصورة الغلاف&nbsp;</label>
                    <a class="fw-bold border rounded cursorBt pe-2" href="#" id="CoverOCR">
                        البحث <i class="fa-solid fa-barcode fs-6 ms-2 me-2"></i>
                    </a>
            </div>
                <!-- Add Book -->
                <div class="form-check mt-1 border rounded mb-2 text-end" 
                    style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;user-select: none">
                <label class="me-3">أضف الكتاب يدويا</label>
                    <a class="fw-bold border rounded cursorBt pe-2 border-warning text-warning" href="#" id="sourceAddbook">
                        اضافة <i class="fa-solid fa-add fs-6 ms-2 me-2 text-warning"></i>
                    </a>                        
            </div>
            </div>
            `, "تم");
    // Add Excel File Routine
    document.getElementById("browse_excelFileBt").onclick = () => {
        document.getElementById("browse_excelFile").click();
        document.getElementById("browse_excelFile").onchange = () => {
            /***
             * Load Effect
             * */
            document.getElementsByClassName('loader')[0].style.display = "";
            document.getElementsByClassName('librarySourceView')[0].style.filter = "blur(8px)";
            let excelFile = document.getElementById("browse_excelFile").files[0] || null;
            misc.postForm('libraryExcel', {
                userId: misc.ID,
                hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                libraryId: mainUUID
            }, excelFile).then((res) => {
                // Success
                if (!res.status) {
                    console.log(res.msg);
                    // Reload Library
                    window.location.href = '/library';
                }
                // Fail
                else {
                    console.error(res.msg);
                    // TODO: Handle the front view
                }
            })
        };
    }
    // OCR Button
    document.getElementById("CoverOCR").onclick = () => {
        showHideSecondaryWindow();
        library.OCRBt.click();
    }
    // Add Book Button
    document.getElementById("sourceAddbook").onclick = () => {
        showHideSecondaryWindow();
        addBookBt.click();
    }
};