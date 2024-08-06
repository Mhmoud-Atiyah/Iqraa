async function loadTheme(themeName) {
    try {
        const response = await fetch(`https://${DOMAIN}/loadStyle/${themeName}`, {
            method: 'GET',
            headers: {
                "Accept": "text/css"
            },
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const cssText = await response.text();
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
    } catch (error) {
        console.error('Error fetching the CSS file:', error);
    }
}