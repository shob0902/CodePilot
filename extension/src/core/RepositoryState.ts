import { ScanResult } from "../types/ScanResult";

export class RepositoryState {

    private static instance: RepositoryState;

    private scanResult: ScanResult | null = null;

    private constructor() {}

    public static getInstance(): RepositoryState {

        if (!RepositoryState.instance) {
            RepositoryState.instance = new RepositoryState();
        }

        return RepositoryState.instance;
    }

    public setScanResult(result: ScanResult): void {
        this.scanResult = result;
    }

    public getScanResult(): ScanResult | null {
        return this.scanResult;
    }

}