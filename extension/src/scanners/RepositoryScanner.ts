import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ScanResult } from "../types/ScanResult";

export class RepositoryScanner {

    private readonly ignoredDirectories = new Set([
        ".git",
        ".github",
        ".vscode",
        "node_modules",
        "venv",
        ".venv",
        "__pycache__",
        "dist",
        "build",
        "out",
        "bin",
        "obj",
        "coverage",
        ".pytest_cache",
        ".mypy_cache",
        ".idea"
    ]);

    public scan(): ScanResult {

        const workspace = vscode.workspace.workspaceFolders;

        if (!workspace || workspace.length === 0) {
            throw new Error("No workspace is open.");
        }

        const rootPath = workspace[0].uri.fsPath;

        const languageMap = new Map<string, number>();
        let totalFiles = 0;

        this.walk(rootPath, languageMap, () => {
            totalFiles++;
        });

        return {
            rootPath,
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
        directory: string,
        languageMap: Map<string, number>,
        incrementFileCount: () => void
    ): void {

        const items = fs.readdirSync(directory);

        for (const item of items) {

            if (this.ignoredDirectories.has(item)) {
                continue;
            }

            const fullPath = path.join(directory, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                this.walk(fullPath, languageMap, incrementFileCount);
                continue;
            }

            incrementFileCount();

            const extension = path.extname(item).toLowerCase();
            const language = this.detectLanguage(extension);

            if (!language) {
                continue;
            }

            languageMap.set(
                language,
                (languageMap.get(language) ?? 0) + 1
            );
        }
    }

    private detectLanguage(extension: string): string | null {

        switch (extension) {

            case ".py":
                return "Python";

            case ".java":
                return "Java";

            case ".c":
                return "C";

            case ".cpp":
            case ".cc":
            case ".cxx":
            case ".hpp":
            case ".h":
                return "C++";

            case ".js":
                return "JavaScript";

            case ".ts":
                return "TypeScript";

            case ".tsx":
                return "React (TypeScript)";

            case ".jsx":
                return "React (JavaScript)";

            case ".go":
                return "Go";

            case ".rs":
                return "Rust";

            case ".cs":
                return "C#";

            case ".kt":
                return "Kotlin";

            case ".swift":
                return "Swift";

            case ".php":
                return "PHP";

            case ".rb":
                return "Ruby";

            case ".scala":
                return "Scala";

            case ".r":
                return "R";

            case ".sql":
                return "SQL";

            case ".html":
                return "HTML";

            case ".css":
                return "CSS";

            case ".json":
                return "JSON";

            case ".xml":
                return "XML";

            case ".yaml":
            case ".yml":
                return "YAML";

            case ".md":
                return "Markdown";

            default:
                return null;
        }
    }
}