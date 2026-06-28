import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ScanResult } from "../types/ScanResult";

export class RepositoryScanner {

    public scan(): ScanResult {

        const workspace = vscode.workspace.workspaceFolders;

        if (!workspace) {
            throw new Error("No workspace is open.");
        }

        const root = workspace[0].uri.fsPath;

        const languageMap = new Map<string, number>();

        let totalFiles = 0;

        this.walk(root, languageMap, () => {
            totalFiles++;
        });

        return {
            rootPath: root,
            totalFiles,
            languages: [...languageMap.entries()]
                .map(([language, count]) => ({
                    language,
                    count
                }))
                .sort((a, b) => b.count - a.count)
        };
    }

    private walk(
        dir: string,
        languageMap: Map<string, number>,
        increment: () => void
    ) {

        const ignore = new Set([
            ".git",
            "node_modules",
            "venv",
            "__pycache__",
            "dist",
            "build"
        ]);

        const items = fs.readdirSync(dir);

        for (const item of items) {

            if (ignore.has(item))
                continue;

            const full = path.join(dir, item);

            const stat = fs.statSync(full);

            if (stat.isDirectory()) {
                this.walk(full, languageMap, increment);
            }
            else {

                increment();

                const ext = path.extname(item);

                const lang = this.detectLanguage(ext);

                if (!lang)
                    continue;

                languageMap.set(
                    lang,
                    (languageMap.get(lang) ?? 0) + 1
                );
            }
        }

    }

    private detectLanguage(ext: string): string | null {

        switch (ext) {

            case ".py":
                return "Python";

            case ".java":
                return "Java";

            case ".cpp":
            case ".cc":
            case ".cxx":
                return "C++";

            case ".c":
                return "C";

            case ".js":
                return "JavaScript";

            case ".ts":
                return "TypeScript";

            default:
                return null;
        }

    }

}