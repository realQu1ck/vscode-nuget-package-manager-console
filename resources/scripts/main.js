(function () {
    const vscode = acquireVsCodeApi();
    const body = document.getElementsByTagName('body');
    const terminal = document.getElementsByTagName('terminal');
    const terminalLog = document.getElementById('log');
    const commandInput = document.getElementById('commandInput');
    const commandSpan = document.getElementById('commandSpan');
    const projectSelect = document.getElementById('projectSelect');

    commandInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                if (command === "clear" || command === "cls") {
                    terminalLog.innerHTML = "";
                } else {
                    CommandStatus(true);
                    // Display the command in the terminal log
                    const commandLine = document.createElement('div');
                    commandLine.classList.add('line');
                    commandLine.innerHTML = `<span>PM>${command}</span>`;
                    terminalLog.appendChild(commandLine);

                    // Send the command to the extension
                    vscode.postMessage({ command: 'executeCommand', text: command, startupProject: GetSelectedStartupProject() });

                    // Clear input field
                }
                commandInput.value = '';
            }
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'log') {
            const logLine = document.createElement('div');
            logLine.classList.add('line');
            logLine.innerHTML = '<span>' + message.text + '</span>';
            terminalLog.appendChild(logLine);

            // Auto scroll to bottom
            terminalLog.scrollTop = terminalLog.scrollHeight;
        }

        if (message.type === "completed") {
            CommandStatus(false);
        }

        if (message.type === 'updateDropdown') {
            const option = document.createElement('option');
            option.value = message.text;
            option.text = message.text;
            projectSelect.appendChild(option);
        }

        body.scrollTop = body.scrollHeight;
    });


    function CommandStatus(status) {
        commandInput.hidden = status;
        commandSpan.hidden = status;
    }

    function GetSelectedStartupProject() {
        var text = projectSelect.options[projectSelect.selectedIndex].value;
        return text;
    }
}());