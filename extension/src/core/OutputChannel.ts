import * as vscode from "vscode";

export class OutputChannel {

    private static readonly channel =
        vscode.window.createOutputChannel("CodePilot");

    public static log(message: string): void {

        this.channel.appendLine(message);

    }

    public static show(): void {

        this.channel.show(true);

    }

    public static clear(): void {

        this.channel.clear();

    }

}