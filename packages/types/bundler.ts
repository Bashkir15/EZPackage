import { RollupOptions } from 'rollup'

export interface BundlerTask {
    rollupConfig: RollupOptions
    taskInfo: {
        format: string;
        name: string;
        output: string;
        version: string;
    };
}
