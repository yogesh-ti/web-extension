import pkceChallenge from "pkce-challenge";
import * as vscode from 'vscode';

// ?client_id=gplctl-1.0&code_challenge=8d4UqVnLKcD3hNlgWqbI67RVhABQstGpr6Cttbt4ImM&code_challenge_method=S256&redirect_uri=http%3A%2F%2F127.0.0.1%3A63119&response_type=code&scope=function%3AgetGitpodTokenScopes+function%3AgetWorkspace+function%3AgetWorkspaces+function%3AlistenForWorkspaceInstanceUpdates+resource%3Adefault&state=state
export let codeVerifier: string;

export function makeAuthUrl() {
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
    const sortedScopes = scopes.sort();
    const scopeString = sortedScopes.join(' ');
    const { code_verifier, code_challenge } = pkceChallenge(84);
    codeVerifier = code_verifier;

    let params = new URLSearchParams([
    ["response_type", "code"],
    ["client_id", "gplctl-1.0"],
    ["redirect_uri", "http://127.0.0.1:63110"],
    ["scope", scopeString],
    ["state", "state"],
    ["code_challenge", code_challenge],
    ["code_challenge_method", "S256"]
    ]);

    let authUrl = `${baseUrl}${authorizeApi}?${params.toString()}`;
    vscode.window.showInformationMessage('Initial data', {modal: true, detail: `URL: ${authUrl}\ncode_verifier: ${codeVerifier}`});
}

const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJHaXRwb2QgbG9jYWwgY29udHJvbCBjbGllbnQiLCJzY29wZSI6ImZ1bmN0aW9uOmdldEdpdHBvZFRva2VuU2NvcGVzIGZ1bmN0aW9uOmdldFdvcmtzcGFjZSBmdW5jdGlvbjpnZXRXb3Jrc3BhY2VzIGZ1bmN0aW9uOmxpc3RlbkZvcldvcmtzcGFjZUluc3RhbmNlVXBkYXRlcyByZXNvdXJjZTpkZWZhdWx0Iiwic3ViIjoiMjM4YTAzYjAtMTc2ZS00N2FhLWE5NjAtYTUyY2JmYTRhOWM4IiwiZXhwIjoxNjU3NTY3NjI0LCJuYmYiOjE2NTc1NjczMjUsImlhdCI6MTY1NzU2NzMyNSwianRpIjoiOTViNDYxYjNkM2MyMTY3YTY3OWIyNTk3YTEwYmU2ZjczNDNlNjQ4YWE4ZWVmYTQ3ZTllNzZiNmNmNmU3In0.SVZlscpH28ExviyOAmcoK3fZauFMczmQUoSF_Zl897Q";
const accessToken = JSON.parse(
  Buffer.from(jwtToken.split(".")[1], "base64").toString()
)["jti"];
console.log(accessToken);
