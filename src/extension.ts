// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import fetch from 'node-fetch'
import * as fs from 'fs';
import { exchangeCodeForToken, makeAuthUrl } from './localAppAuth';

const authPath: string = '/auth-complete';

export function executeTerminalCommandSync(command: string, options?: any): string {
	return child_process.execSync(command,{shell: '/bin/bash', encoding: 'utf8', ...options}).toString().trim();
}

function getDefaultBranchFromRepo(repo: string): string {
  const command = `cd $GITPOD_REPO_ROOT && git remote show ${repo} | grep 'HEAD branch' | cut -d' ' -f5`;
  console.log(`Command: ${command}`);
  const branch = executeTerminalCommandSync(command);
  console.log(`Branch: ${branch}`);
	console.log(executeTerminalCommandSync('pwd'));
	console.log(process.cwd());
  return branch;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	vscode.window.registerUriHandler({
		handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
			if (uri.path === authPath) {
				console.log('RECEIVED');
				console.log(uri.toString());
				console.log(uri);
			}
		}
	});
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
		// console.log(child_process.execSync('pwd'));
		// let repoUrl = await vscode.window.showInputBox();
		// if(repoUrl !== undefined) {
		// 	const components = repoUrl.split('/tree/');
		// 	const repo = components[0];
		// 	components.splice(0,1)
		// 	let branch = components.join('/tree/');
		// 	if(branch === '') {
		// 		branch = getDefaultBranchFromRepo(repo);
		// 	}
		// 	console.log(`Repo: ${repo}`)
		// 	console.log(`Branch: ${branch}`);
		// }
		const uri = await vscode.env.asExternalUri(vscode.Uri.parse(`${vscode.env.uriScheme}://TI.test${authPath}`));
		console.log('1:', uri);
		const extensionCallbackUri: string = uri.toString();
		console.log('2:', uri.toString());
		const loginUrl = `https://trilogy.devspaces.com/api/login?host=github.com&returnTo=${extensionCallbackUri}`
		await vscode.env.openExternal(vscode.Uri.parse(loginUrl));
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('test.localAppAuth', async () => {
		const codeVerifier: string = await makeAuthUrl();
		const code: string = await vscode.window.showInputBox({title: 'Enter the code', ignoreFocusOut: true})??'';
		try {
			const jwtToken = await exchangeCodeForToken(code, codeVerifier);
			const accessToken = JSON.parse(
			Buffer.from(jwtToken.split(".")[1], "base64").toString()
			)["jti"];
			vscode.window.showInformationMessage('Access token', {modal: true, detail: accessToken});
		} catch (error) {
			console.log('Error:', error);
		}
	});
	context.subscriptions.push(disposable);


}

// this method is called when your extension is deactivated
export function deactivate() {}
