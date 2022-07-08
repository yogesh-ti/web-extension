import * as http from 'http';
import * as vscode from 'vscode';
import { executeTerminalCommandSync } from './extension';

export function startReceiverServer(): void {
    console.log('FUNC: startReceiverServer');
    const server = http.createServer(function (req: http.IncomingMessage, res) {
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
            var obj = JSON.parse(body);
            let command = obj.command.toString();
            if(command === 'keepAlive') {
                vscode.window.showInformationMessage("Keep alive");
                executeTerminalCommandSync('gp url');
            }
        });
        req.on('end', function () {
            console.log('Body: ' + body);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('post received');
        });
    }).listen(5000);
}