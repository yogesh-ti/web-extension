// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import axios from 'axios';
import { startReceiverServer } from './receiverServer';

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

export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function repeatedMessages(target: string) {
	while(true) {
		try {
			axios.post(target, {"command": "keepAlive"});
		} catch (error) {
			console.log('repeatedMessages failed request:', error);
		}
		await delay(5 * 60 * 1000);
	}
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

		startReceiverServer()
		vscode.window.showInputBox()
			.then((value) => {
				if(value === undefined) {
					console.log('No target url provided');
					return;
				}
				repeatedMessages(value);
			});
		

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
