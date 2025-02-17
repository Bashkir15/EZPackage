import { ArgDescriptor } from 'command-line-args'
import { ModuleFormat, RollupOptions } from 'rollup'
import env from 'std-env'
import Listr, { ListrTask } from 'listr'

/**
 * Project Configuration
 */

export type ProjectDependencies = {
    development: Set<string>,
    peer: Set<string>,
    runtime: Set<string>
}
export type ProjectPaths = {
    config?: string
    output?: string
    root: string
    test?: string
}
export type ProjectEngineRequirements = {
    git: string
    node: string
    npm: string
    yarn: string
}

export interface SharedConfig {
    exec?: boolean
    interactive?: boolean
    notify?: boolean
    quiet?: boolean
    releaseType?: string
    runBuild?: boolean
    runCleanup?: boolean
    runPublish?: boolean
    runTests?: boolean
    sourcemap?: boolean
    testCommand?: string
    useYarn?: boolean
    verbose?: boolean
    watch?: boolean
}

export interface CliConfig extends SharedConfig {
    browserEntry?: string
    cliEntry?: string
    configPath?: string
    libraryEntry?: string
    nodeEntry?: string
    outputPath?: string
    testPath?: string
    rootPath?: string
}

export interface ProjectConfig extends SharedConfig {
    entries: {
        browser?: string;
        cli?: string | {[key: string]: any},
        library?: string
        node?: string
    }
    env: env
    hasPackageLock?: boolean
    packageJSON: {
        author?: string | {
            email?: string
            name?: string
        }
        bin?: string
        browser?: string
        dependencies: ProjectDependencies
        main?: string
        module?: string
        name?: string
        publishConfig?: {
            registry?: string
            [key: string]: any
        },
        private?: boolean
        umd?: string
        version?: string
    }
    paths: ProjectPaths
    requiredEngines?: ProjectEngineRequirements
    // TODO Rollup typing
    rollup: RollupOverride
    tsConfig?: {
        [key: string]: any
    }
    useExternalRegistry?: boolean
}

/**
 * Command Configuration
 */

export type CommandResult = Promise<{ successful: boolean }>

export interface Command {
    aliases: string[]
    args: ArgDescriptor[]
    description: string
    name: string
    run(projectConfig: ProjectConfig, commandContext?): CommandResult
}

/** 
 * Bundle Types
 */

export interface RollupOverride { 
    (passedConfig: RollupOptions, projectConfig: RollupTask): RollupOptions
}
export type BundlerTasks = RollupOptions[]

export type BundlerPackageOutput = {
    binaries?: string | {[key: string]: any}
    browser?: string
    main?: string
    module?: string
    types?: string
    umd?: string
}

export type BundleFormats = "cjs" | "esm" | "tsc" | "umd"
export type BundleTargets = 'browser' | 'cli' | 'lib' | 'node'

export interface RollupTask {
    banner: string,
    env: env,
    format: ModuleFormat
    input: string
    output: string
    packageJSON: {
        dependencies: ProjectDependencies
        name: string
        version: string
    }
    paths: ProjectPaths
    rollup: RollupOverride
    sourcemap?: boolean
    target: BundleTargets
    watch?: {
        exclude?: string
    }
}
