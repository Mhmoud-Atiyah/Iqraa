export default function riwaqScreen(screen) {
    if (screen === "myScreen") {
        (async () => {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(stream => {
                    riwaq.myScreen.style.marginTop = '8px'
                    riwaq.myScreen.srcObject = stream;
                    riwaq.myScreen.play();
                })
        })()
    } else if (screen === "otherScreen") {
    }
}