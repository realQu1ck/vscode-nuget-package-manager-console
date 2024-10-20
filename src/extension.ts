import * as vscode from 'vscode';
import NugetConsoleWebviewProvider from './nugetConsoleWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
    // Register the Webview view provider
    const provider = new NugetConsoleWebviewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(NugetConsoleWebviewProvider.viewType, provider)
    );
}

export function deactivate() { }
