// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function executeTerminalCommandSync(command: string, options?: any): string {
	return child_process.execSync(command,{shell: '/bin/bash', encoding: 'utf8', ...options}).toString().trim();
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('test.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.env.openExternal(vscode.Uri.parse('https://trilogy.devspaces.com/#https://github.com/yogesh-ti/temp-1'));
		vscode.window.showInformationMessage('Hello World from test!');
		try {
			const res = executeTerminalCommandSync(`gp await-port 1234`, {timeout: 15*1000});
			console.log(res);
		} catch (error) {
			console.log('Error:', error);
		}
		
		vscode.window.showInformationMessage('Killed the given command');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
