import pkceChallenge from "pkce-challenge";
import * as vscode from 'vscode';
import axios from 'axios'

const baseUrl: string = "https://trilogy.devspaces.com";
const authorizeApi: string = "/api/oauth/authorize";
const tokenApi: string = "/api/oauth/token";
const scopes: string[] = [
    "function:getGitpodTokenScopes",
    "function:getWorkspace",
    "function:getWorkspaces",
    "function:listenForWorkspaceInstanceUpdates",
    "resource:default"
];
const clientId = "gplctl-1.0";
const clientSecret = "gplctl-1.0-secret";
const redirectUri = "http://127.0.0.1:63110";
// ?client_id=gplctl-1.0&code_challenge=8d4UqVnLKcD3hNlgWqbI67RVhABQstGpr6Cttbt4ImM&code_challenge_method=S256&redirect_uri=http%3A%2F%2F127.0.0.1%3A63119&response_type=code&scope=function%3AgetGitpodTokenScopes+function%3AgetWorkspace+function%3AgetWorkspaces+function%3AlistenForWorkspaceInstanceUpdates+resource%3Adefault&state=state
let codeVerifier: string;

export async function makeAuthUrl(): Promise<string> {
    const sortedScopes = scopes.sort();
    const scopeString = sortedScopes.join(' ');
    const { code_verifier, code_challenge } = pkceChallenge(84);
    codeVerifier = code_verifier;

    let params = new URLSearchParams([
    ["response_type", "code"],
    ["client_id", clientId],
    ["redirect_uri", redirectUri],
    ["scope", scopeString],
    ["state", "state"],
    ["code_challenge", code_challenge],
    ["code_challenge_method", "S256"]
    ]);

    const authUrl = `${baseUrl}${authorizeApi}?${params.toString()}`;
    let detail: string = `URL: ${authUrl}\ncode_verifier: ${codeVerifier}`;
    await vscode.window.showInformationMessage('Use this url to get code', {modal: true, detail: detail});
    return codeVerifier;
}

export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<string> {
    const body = {
        "code": code,
        "grant_type": "authorization_code",
        "client_id": clientId,
        "client_secret": clientSecret,
        "redirect_uri": redirectUri,
        "code_verifier": codeVerifier,
        "state": "state"
    }
    const tokenUrl = `${baseUrl}${tokenApi}`
    const tokenExchangeResponse = await axios.post(tokenUrl, body);
    console.log('Token Exchange Response:', tokenExchangeResponse);
    return tokenExchangeResponse.data.access_token;
}
