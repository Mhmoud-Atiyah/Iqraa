const {exec} = require('child_process');
const {platform} = require('os');
const net = require('net');
const http = require('http');


function portListening(host, port, timeout = 1000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.setTimeout(timeout);

        socket.on('connect', () => {
            console.log(`Port ${port} on ${host} is open`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`Port ${port} on ${host} is closed (timeout)`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.log(`Port ${port} on ${host} is closed [First time!] (error: ${err.message})`);
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, host);
    });
}

function setAirplaneMode(state) {
    var command = "";
    if (platform() === "linux") {
        command = state ? 'nmcli radio all off' : 'nmcli radio all on';
    } else if (os.platform() === "win32") {
        command = state ? 'powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Add-Type -TypeDefinition \\"using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\\\\\"user32.dll\\\\\\")] public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam); }\\\"; $APMMode=0x5F1; $APMOn=0x1; $APMOff=0x0; if ($args[0] -eq \\\\\\"on\\\\\\") { [Win32]::SendMessage(0xFFFF, $APMMode, $APMOn, 0) } else { [Win32]::SendMessage(0xFFFF, $APMMode, $APMOff, 0) }" on' : 'powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Add-Type -TypeDefinition \\"using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\\\\\"user32.dll\\\\\\")] public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam); }\\\"; $APMMode=0x5F1; $APMOn=0x1; $APMOff=0x0; if ($args[0] -eq \\\\\\"on\\\\\\") { [Win32]::SendMessage(0xFFFF, $APMMode, $APMOn, 0) } else { [Win32]::SendMessage(0xFFFF, $APMMode, $APMOff, 0) }" off';
    } else if (os.platform() === "darwin") {
        command = state ? 'osascript -e "do shell script \\"networksetup -setairportpower airport off\\""' : 'osascript -e "do shell script \\"networksetup -setairportpower airport on\\""';
    } else {
        console.log("Platform Not Supported!");
    }
    ;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
}

// Turn on airplane mode
// setAirplaneMode(false);

function checkOnline() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'www.google.com',
            port: 80,
            path: '/',
            timeout: 5000,
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.abort();
            resolve(false);
        });

        req.end();
    });
}

/**
 * Retrieves the IPv4 address of the current machine.
 * @returns {string} The IPv4 address.
 */
function getIPAddress() {
    const os = require('os');
    const interfaces = os.networkInterfaces();

    // Iterate over network interfaces
    for (const key of Object.keys(interfaces)) {
        const iface = interfaces[key];

        // Iterate over addresses of the interface
        for (const address of iface) {
            // Check for IPv4 and non-internal address
            /* TODO: Set Internet Interface Name */
            if (address.family === 'IPv4' && !address.internal && key === "enp0s8") {
                return address.address;
            }
        }
    }

    // If no valid address found
    return 'Unable to retrieve IP address';
}

module.exports = {
    portListening,
    setAirplaneMode,
    checkOnline,
    getIPAddress
}