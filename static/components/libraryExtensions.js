import showHideSecondaryWindow from "../JS/SecondaryWindow.js";

export default function libraryExtensions() {
    //TODO: on load get already enabled buttons
    let div = `
         <!-- Hindawi -->
            <div class="form-check form-switch pt-2 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">مؤسسة هنداوي</label>
            </div>
            <!-- Shamela -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">المكتبة الشاملة </label>
            </div>
            <!-- Gutenberg -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">مكتبة جوتنبرج</label>
            </div>
            <!-- TelegramBot -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">قناة تليجرام (<u>يمكنك اضافة قنوات
                        مختلفة</u>)</label>
            </div>
            <!-- Amazon -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">كتب امازون <u>(في حالة تفعيل خيار
                        الشراء)</u></label>
            </div>
    `;
    showHideSecondaryWindow("الإضافات", div, "تم");
}