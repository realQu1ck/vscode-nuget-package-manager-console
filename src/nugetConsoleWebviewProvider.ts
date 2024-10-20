import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import GenerateBody from "./htmlGenerator";
import { DotNetCommandManager } from './commands/dotnet-commands';

export default class NugetConsoleWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'nugetConsoleView';

    private _view?: vscode.WebviewView;

    constructor(private readonly context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken) {
        this._view = webviewView;
        // Setup the initial HTML content for the webview
        webviewView.webview.options = {
            enableScripts: true,

            localResourceRoots: [
                this.context.extensionUri
            ]
        };

        webviewView.webview.html = this.getWebviewContent(webviewView.webview);

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const folderPath = workspaceFolders[0].uri.fsPath;
            const slnFiles = findSolutionFiles(folderPath);

            if (slnFiles.length > 0) {
                const slnPath = slnFiles[0]; // Take the first solution file found
                const projects = readSolutionFile(slnPath);

                // Populate the dropdown in the webview
                populateProjectDropdown(webviewView, projects);
            } else {
                vscode.window.showWarningMessage('No .sln file found in the workspace.');
            }
        }

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'executeCommand') {
                this.handleCommand(message.text, webviewView.webview, message.startupProject);
            }
        });
    }

    private completeCommand(webview: vscode.Webview) {
        webview.postMessage({ type: 'completed', text: `Error` });
    }

    // Handle the user commands
    private handleCommand(command: string, webview: vscode.Webview, startupProject: string) {
        if (startupProject === "null" || startupProject === null || startupProject === undefined) {
            webview.postMessage({ type: 'log', text: 'Please Select Startup Project!' });
            this.completeCommand(webview);
            return;
        }
        const dotnetCommand = new DotNetCommandManager();
        const wanted = dotnetCommand.getCommands().filter(x => x.command.startsWith(command))[0];
        if (wanted) {
            var execute = dotnetCommand.executeCommandByName(wanted.command);
            webview.postMessage({ type: 'log', text: execute });
            this.completeCommand(webview);
        } else {
            webview.postMessage({ type: 'log', text: `Unknown command: ${command}` });
            this.completeCommand(webview);
        }
        // if (command.startsWith('Install-Package')) {
        //     webview.postMessage({ type: 'log', text: 'Installing package...' });
        //     setTimeout(() => {
        //         webview.postMessage({ type: 'log', text: 'Package installed successfully!' });
        //     }, 2000);
        //     this.completeCommand(webview);
        // } else {
        //     webview.postMessage({ type: 'log', text: `Unknown command: ${command}` });
        //     this.completeCommand(webview);
        // }
    }

    // HTML content for the Webview
    private getWebviewContent(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'scripts', 'main.js'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'styles', 'main.css'));
        return GenerateBody(styleMainUri, scriptUri);
    }
}

// Function to find .sln files in the workspace
function findSolutionFiles(folderPath: string): string[] {
    const files = fs.readdirSync(folderPath);
    return files.filter(file => file.endsWith('.sln')).map(file => path.join(folderPath, file));
}

// Function to read the solution file and extract project names
function readSolutionFile(slnPath: string): string[] {
    const fileContent = fs.readFileSync(slnPath, 'utf8');
    const projectRegex = /Project\(".*?"\)\s=\s"(.*?)",/g;
    const projects: string[] = [];
    let match;

    // Find all project definitions
    while ((match = projectRegex.exec(fileContent)) !== null) {
        projects.push(match[1]); // Project name is the first capture group
    }

    return projects;
}

// Function to populate the project dropdown in the webview
function populateProjectDropdown(panel: any, projects: string[]) {
    const filter_projects = ["docker", "docker-compose"];
    projects.map((project) => {
        if (!filter_projects.includes(project))
            panel.webview.postMessage({ type: 'updateDropdown', text: project });
    });
}

