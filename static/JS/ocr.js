// Configuration
const FRAME_INTERVAL = 1000; // Capture frame every 1 second
const OCR_LANGUAGE = 'ara'; // Set language to English; adjust as needed

let captureInterval = null;
let isProcessing = false;

async function initializeCamera(video, output) {
    try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false});
        video.srcObject = stream;
        video.play();
        output.innerText = 'تم تحميل الكاميرا. جاري تهيئة OCR...';
    } catch (error) {
        console.error('Error accessing camera:', error);
        output.innerText = 'حدث خطأ أثناء الوصول إلى الكاميرا. يُرجى السماح بالوصول إلى الكاميرا والمحاولة مرة أخرى.';
    }
}

async function initializeOCR(output) {
    try {
        // Load Tesseract.js worker
        await worker.load();
        await worker.loadLanguage(OCR_LANGUAGE);
        await worker.initialize(OCR_LANGUAGE);
        output.innerText = 'تم تهيئة OCR. جاهز للبدء.';
    } catch (error) {
        console.error('Error initializing Tesseract.js:', error);
        output.innerText = 'حدث خطأ أثناء تهيئة OCR. يُرجى مراجعة وحدة التحكم للحصول على التفاصيل.';
    }
}

export default async function OCR(video, canvas, output, ProgressBar, exitButton) {
    const ctx = canvas.getContext('2d');
    // Initialize Tesseract.js worker
    const Tesseract = window.Tesseract;
    const worker = Tesseract.createWorker({
        logger: m => {
            if (m.status === 'recognizing text') {
                ProgressBar.style.width = `${(m.progress * 100).toFixed(2)}%`;
            }
        }
    });
    // Initialize the camera on page load
    (async () => {
        await initializeCamera(video, output);
    })();
    // Initialize the OCR  on page load
    try {
        // Load Tesseract.js worker
        await worker.load();
        await worker.loadLanguage(OCR_LANGUAGE);
        await worker.initialize(OCR_LANGUAGE);
        output.innerText = 'تم تهيئة OCR. جاهز للبدء.';
    } catch (error) {
        console.error('Error initializing Tesseract.js:', error);
        output.innerText = 'حدث خطأ أثناء تهيئة OCR. يُرجى التحقق من Console للحصول على التفاصيل.';
    }
    if (captureInterval) return; // Prevent multiple intervals
    output.textContent = 'بدء OCR...';
    captureInterval = setInterval(async () => {
        if (isProcessing) return; // Skip if already processing

        isProcessing = true;

        try {
            // Set canvas dimensions to match video
            const resizeFactor = 0.5; // Reduce resolution for performance
            canvas.width = video.videoWidth * resizeFactor;
            canvas.height = video.videoHeight * resizeFactor;

            // Draw the current frame from the video onto the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Optionally, crop the image to a specific region
            // Example: Capture the center region
            /*
            const cropWidth = canvas.width * 0.8;
            const cropHeight = canvas.height * 0.2;
            const startX = (canvas.width - cropWidth) / 2;
            const startY = canvas.height - cropHeight - 10; // 10px from bottom
            const croppedImage = ctx.getImageData(startX, startY, cropWidth, cropHeight);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(croppedImage, 0, 0);
            */

            // Get the image data from the canvas
            const imageData = canvas.toDataURL('image/png');

            // Perform OCR on the captured frame
            const {data: {text}} = await worker.recognize(imageData);

            // Display the recognized text
            output.textContent = text.trim() || 'لم يتم الكشف عن أي نص.';
        } catch (error) {
            console.error('Error during OCR processing:', error);
            output.textContent = 'خطأ أثناء معالجة OCR.';
        } finally {
            isProcessing = false;
        }
    }, FRAME_INTERVAL);
    /***
     * Stop OCR and Camera on exit
     * */
    exitButton.addEventListener('click', () => {
        if (captureInterval) {
            // Stop OCR
            clearInterval(captureInterval);
            captureInterval = null;
            output.textContent = 'تم إيقاف OCR.';
            console.log("OCR Stopped.");
            // Stop Camera
            if (video.srcObject) {
                let tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                console.log("Camera Stopped.");
            } else {
                console.log("No camera stream to disable.");
            }
        }
    })
}
