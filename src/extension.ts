// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import fetch from 'node-fetch'
import * as fs from 'fs';
import { makeAuthUrl } from './localAppAuth';

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
		const code: string = 'eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiJncGxjdGwtMS4wIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzEyNy4wLjAuMTo2MzExOSIsImF1dGhfY29kZV9pZCI6ImM5OGFkYmQ2ODEwYjY2NjhjOGM1Y2M0MTZmZTQxZThhZDg1ZDcxNzcwYjY1NWVkOGMzYmJmMmY1N2U1NCIsInNjb3BlcyI6WyJmdW5jdGlvbjpnZXRHaXRwb2RUb2tlblNjb3BlcyIsImZ1bmN0aW9uOmdldFdvcmtzcGFjZSIsImZ1bmN0aW9uOmdldFdvcmtzcGFjZXMiLCJmdW5jdGlvbjpsaXN0ZW5Gb3JXb3Jrc3BhY2VJbnN0YW5jZVVwZGF0ZXMiLCJyZXNvdXJjZTpkZWZhdWx0Il0sInVzZXJfaWQiOiIyMzhhMDNiMC0xNzZlLTQ3YWEtYTk2MC1hNTJjYmZhNGE5YzgiLCJleHBpcmVfdGltZSI6MTY1NzU1NjIwMCwiY29kZV9jaGFsbGVuZ2UiOiI1MTlXUGlCMGV0U0JrRlhlLTRPSHZGZ04wQnc2VHR0ZDdRVGFYenVhU0lZIiwiY29kZV9jaGFsbGVuZ2VfbWV0aG9kIjoiUzI1NiJ9.Q6lw8nFhJ0UcGx1QvMeV4v7bjXdGclTkBS-DTOITM4s';
		// const exchangeTokenResponse = await fetch(`https://trilogy.devspaces.com/api/oauth/token`, {
		// 	method: 'POST',
		// 	body: new URLSearchParams({
		// 		code,
		// 		grant_type: 'authorization_code',
		// 		client_id: `gplctl-1.0`,
		// 		redirect_uri: "http://127.0.0.1:63110",
		// 		code_verifier: "hqTxLvvaxAdpobefdLMM~uXDYg9tZHAegJsPD3p8fVjZrEJ0O5A1_.Gee78Au9FimS-G9E1rZDkBRyKsyFlG"
		// 	})
		// })
		// .then(async(value) => {
		// 	await value.json();
		// });
		// await exchangeTokenResponse.json();

		// console.log(exchangeTokenResponse);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('test.getAuthUrl', async () => {
		makeAuthUrl();
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
