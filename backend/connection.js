const { exec } = require('child_process');
const { platform } = require('os');

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
    };
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
setAirplaneMode(false);
