import * as vscode from "vscode";

export class CodePilotProvider
    implements vscode.TreeDataProvider<TreeItem> {

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<TreeItem[]> {

        return Promise.resolve([

            new TreeItem(
                "Repository",
                vscode.TreeItemCollapsibleState.Expanded
            ),

            new TreeItem(
                "Optimization Score : Not Scanned",
                vscode.TreeItemCollapsibleState.None
            ),

            new TreeItem(
                "Security : Not Scanned",
                vscode.TreeItemCollapsibleState.None
            )

        ]);

    }

}

class TreeItem extends vscode.TreeItem {

    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

}