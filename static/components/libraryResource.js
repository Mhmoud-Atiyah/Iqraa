import misc from "../JS/misc.js";
import showHideSecondaryWindow from '../JS/SecondaryWindow.js';

export default function libraryResource() {
    showHideSecondaryWindow("حدد مصادر بيانات المكتبة", `
            <!-- Excel -->
            <div class="form-check mt-1 border rounded mb-2" 
                    style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;width: 300px;user-select: none">
                <form id="upload-form" enctype="multipart/form-data" action="/libraryExcel/${misc.ID}" method="post">
                    <label class="form-check-label me-3" for="flexSwitchCheckChecked">تحميل مِلَفّ البيانات&nbsp;</label>
                    <a class="fs-5" href="https://github.com/Mhmoud-Atiyah/iqraa/blob/master/DOC/goodreads.md" target="_blank" 
                        title="شرح كيفية تحميل الملف والصيغة المطلوبة" style="text-decoration: underline">(الطريقة)</a>
                    <a class="fw-bold border rounded cursorBt" href="#" id="browse_excelFileBt">
                        <input class="form-control-file" type="file" name="file" style="display:none" id="browse_excelFile" accept=".xls">
                        <button type="submit" id="browse_excelFile_submit" style="display: none"></button>
                        اختر ملف<i class="fa-solid fa-file-excel fs-6 ms-1 me-2"></i>
                    </a>
                </form>
            </div>
            <!-- OCR -->
            <div class="form-check mt-1 border rounded mb-2" 
                    style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;user-select: none">
                    <label class="form-check-label me-3" for="flexSwitchCheckChecked">البحث بصورة الغلاف&nbsp;</label>
                    <a class="fw-bold border rounded cursorBt pe-2" href="#" id="CoverOCR">
                        البحث <i class="fa-solid fa-barcode fs-6 ms-2 me-2"></i>
                    </a>
            </div>
            <div class="form-check mt-1 border rounded mb-2 text-end" 
                    style="font-family: Moharram, serif;font-size: 24px;padding-bottom: 4px;user-select: none">
                <label class="me-3">أضف الكتاب يدويا</label>
                    <a class="fw-bold border rounded cursorBt pe-2 border-warning text-warning" href="#" id="sourceAddbook">
                        اضافة <i class="fa-solid fa-add fs-6 ms-2 me-2 text-warning"></i>
                    </a>                        
            </div>
            `, "تم");
    // Add Excel File Routine
    document.getElementById("browse_excelFileBt").onclick = () => {
        document.getElementById("browse_excelFile").click();
        document.getElementById("browse_excelFile").onchange = () => {
            setTimeout(() => {
                /*TODO: Loading Message or sign or gif */
                document.getElementById("upload-form").submit();
                misc.postData(`editConfig/${misc.ID}/`, {
                    newlibrary: false
                }).then((res) => {
                    if (res) {
                        console.log(res);
                        // Clear Screen
                        while (mainView.firstChild) {
                            // Remove each child element
                            mainView.removeChild(mainView.firstChild);
                        }
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            }, 2000);
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