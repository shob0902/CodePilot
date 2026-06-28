export interface LanguageStats {
    language: string;
    count: number;
}

export interface ScanResult {
    rootPath: string;
    totalFiles: number;
    languages: LanguageStats[];
}