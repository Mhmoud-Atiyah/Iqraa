export default function ocrScreen() {
    return `
        <div style="user-select: none" class="ps-2 pe-2">
        <!-- OCR Screen (Video Element) -->
        <video id="OCRScreen" style="background-color: var(--App-inputBgColor)" autoplay muted class="rounded" width="380px" height="300px">
        </video>
        <!-- Canvas -->
        <canvas id="canvas" style="display: none;"></canvas>
        <!-- Multiple -->
        <div class="form-check" style="font-family: Moharram, serif;">
                        <input class="form-check-input float-end me-2 ms-2" type="checkbox" value="" style="margin-top: 7px">
                        <label class="form-check-label" for="readConditions" 
                            style="position: relative;top: -7px;font-size: 24px;">
                            البحث عن كتب متعددة</label>
        </div>
        <!-- Progress Bar -->
        <div class="progress mb-3 w-100" style="background-color: var(--App-inputBgColor);transform: scaleX(-1)">
            <div id="ocrProgressBar" class="progress-bar" role="progressbar" style="width: 20%;color: var(--App-textColor);background-color: var(--App-placeholderColor)"></div>
        </div>
        <!-- Recognized Text Area -->
        <div class="rounded-1 w-100 text-lg-center mb-2">
            <!-- Recognized text will appear here -->
            <p id="recognizedText" class="mb-0 p-2" style="overflow-y: auto;color: var(--App-placeholderColor);font-family: TheYearofTheCamelBold, serif">بين بين بين بين بين القصرين...</p>
        </div>
    </div>
    `;
}