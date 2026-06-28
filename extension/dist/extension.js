"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));

// src/scanners/RepositoryScanner.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var RepositoryScanner = class {
  ignoredDirectories = /* @__PURE__ */ new Set([
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
  scan() {
    const workspace2 = vscode.workspace.workspaceFolders;
    if (!workspace2 || workspace2.length === 0) {
      throw new Error("No workspace is open.");
    }
    const rootPath = workspace2[0].uri.fsPath;
    const languageMap = /* @__PURE__ */ new Map();
    let totalFiles = 0;
    this.walk(rootPath, languageMap, () => {
      totalFiles++;
    });
    return {
      rootPath,
      totalFiles,
      languages: [...languageMap.entries()].map(([language, count]) => ({
        language,
        count
      })).sort((a, b) => b.count - a.count)
    };
  }
  walk(directory, languageMap, incrementFileCount) {
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
  detectLanguage(extension) {
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
};

// src/views/CodePilotProvider.ts
var vscode2 = __toESM(require("vscode"));
var CodePilotProvider = class {
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    return Promise.resolve([
      new TreeItem2(
        "Repository",
        vscode2.TreeItemCollapsibleState.Expanded
      ),
      new TreeItem2(
        "Optimization Score : Not Scanned",
        vscode2.TreeItemCollapsibleState.None
      ),
      new TreeItem2(
        "Security : Not Scanned",
        vscode2.TreeItemCollapsibleState.None
      )
    ]);
  }
};
var TreeItem2 = class extends vscode2.TreeItem {
  constructor(label, collapsibleState) {
    super(label, collapsibleState);
  }
};

// src/extension.ts
function activate(context) {
  console.log("\u{1F680} CodePilot Activated");
  const codePilotProvider = new CodePilotProvider();
  vscode3.window.registerTreeDataProvider(
    "repositoryView",
    codePilotProvider
  );
  const scanRepositoryCommand = vscode3.commands.registerCommand(
    "codepilot.scanRepository",
    () => {
      try {
        const scanner = new RepositoryScanner();
        const result = scanner.scan();
        const languages = result.languages.map((language) => `${language.language}: ${language.count}`).join("\n");
        vscode3.window.showInformationMessage(
          "\u2705 Repository Scanned Successfully"
        );
        vscode3.window.showInformationMessage(
          `\u{1F4C1} Total Files: ${result.totalFiles}`
        );
        vscode3.window.showInformationMessage(
          languages || "No supported languages found."
        );
      } catch (error) {
        vscode3.window.showErrorMessage(
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );
  context.subscriptions.push(scanRepositoryCommand);
}
function deactivate() {
  console.log("\u{1F44B} CodePilot Deactivated");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
