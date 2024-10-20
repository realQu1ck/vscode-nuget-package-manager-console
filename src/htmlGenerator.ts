import * as vscode from 'vscode';

export default function GenerateBody(mainCSS: vscode.Uri, mainJs: vscode.Uri) {
    const nonce = getNonce();

    return `
         <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuget Console</title>
            <link href="${mainCSS}" rel="stylesheet">
        </head>
        <body>
            <div>
                <label for="projectSelect">Default Project:</label>
                <select id="projectSelect">
                    <option selected value="null">Choose Project</option>
                </select>
            </div>
            <div id="terminal">
                <div id="log"></div>
                <div class="input-line">
                    <span id="commandSpan">PM></span>
                    <input type="text" id="commandInput" autofocus>
                </div>
            </div>
     		<script nonce="${nonce}" src="${mainJs}"></script>
        </body>
        </html>
    `;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
