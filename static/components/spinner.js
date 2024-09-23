export default function spinner() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="84" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
        <circle cx="16" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0.2s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0.2s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
        <circle cx="50" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0.4s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0.4s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
    </svg>
    `;
}