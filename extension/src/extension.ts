import * as vscode from "vscode";
import { RepositoryScanner } from "./scanners/RepositoryScanner";
import { CodePilotProvider } from "./views/CodePilotProvider";

export function activate(context: vscode.ExtensionContext): void {

    console.log("🚀 CodePilot Activated");

    // Register CodePilot Sidebar
    const codePilotProvider = new CodePilotProvider();

    vscode.window.registerTreeDataProvider(
        "repositoryView",
        codePilotProvider
    );

    // Register Scan Repository Command
    const scanRepositoryCommand = vscode.commands.registerCommand(
        "codepilot.scanRepository",
        () => {

            try {

                const scanner = new RepositoryScanner();

                const result = scanner.scan();

                const languages = result.languages
                    .map(language => `${language.language}: ${language.count}`)
                    .join("\n");

                vscode.window.showInformationMessage(
                    "✅ Repository Scanned Successfully"
                );

                vscode.window.showInformationMessage(
                    `📁 Total Files: ${result.totalFiles}`
                );

                vscode.window.showInformationMessage(
                    languages || "No supported languages found."
                );

            } catch (error) {

                vscode.window.showErrorMessage(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );

            }

        }
    );

    context.subscriptions.push(scanRepositoryCommand);

}

export function deactivate(): void {
    console.log("👋 CodePilot Deactivated");
}