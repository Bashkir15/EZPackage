import { ArgDescriptor } from 'command-line-args'

export interface ExtendableCustomObject {
    [key: string]: any;
}
export type StandardEnvironment = {
    browser: boolean
    ci: boolean
    darwin: boolean
    debug: boolean
    dev: boolean
    linux: boolean
    minimal: boolean
    minimalCLI: boolean
    production: boolean
    test: boolean
    tty: boolean
    windows: boolean
};


export type PackageDependencyType = ExtendableCustomObject | Set<string>;

export type PackageDependencies = ExtendableCustomObject & {
    development: PackageDependencyType;
    peer: PackageDependencyType;
    runtime: PackageDependencyType;
};

export type PackageEngines = {
    git?: string
    node?: string
    yarn?: string
    [key: string]: string
}

export interface PackageJSON extends ExtendableCustomObject {
    author?: string | {
        email?: string;
        name?: string;
    };
    bin?: string;
    browser?: string;
    dependencies: PackageDependencies;
    main?: string;
    module?: string;
    name?: string;
    umd?: string;
    version?: string;
    [key: string]: string | {[key: string]: string};
}

type ProjectOutput = {
    binaries?: string | ExtendableCustomObject;
    browser?: string;
    main?: string;
    module?: string;
    types?: string;
    umd?: string;
}

export interface CommonConfig {
    env?: StandardEnvironment;
    notify?: boolean;
    output?: ProjectOutput;
    packageJSON?: PackageJSON;
    paths: {
        config?: string;
        output?: string;
        root?: string;
    };
    runCleanup?: boolean;
    quiet?: boolean;
    verbose?: boolean;
    useYarn?: boolean;
};

export interface BundleConfig extends CommonConfig {
    entries: {
        browser?: string;
        cli?: string | ExtendableCustomObject;
        library?: string;
        node?: string;
    };
    exec?: boolean;
    rollup?(passedConfig, options: BundleConfig) : Promise<ExtendableCustomObject> | ExtendableCustomObject;
    tsConfig?: ExtendableCustomObject;
    watch?: boolean 
};

export interface PublishConfig extends CommonConfig {
    anyBranch?: boolean;
    branch?: string;
    contents?: string;
    enableTwoFactor?: boolean;
    preview?: boolean;
    releaseDraft?: boolean;
    // Make this actual valid release types
    releaseType?: string;
    runBuild?: boolean;
    runPublish?: boolean;
    tag?: string;
    testScript?: string;
};

export type ProjectConfig = BundleConfig & PublishConfig;

export interface Command {
    aliases: string[];
    args: ArgDescriptor[];
    description: string;
    name: string;
    run(projectConfig: ProjectConfig): Promise<void>;
}

export type CliArguments = {
    browserEntry?: string
    cliEntry?: string
    configPath?: string
    libraryEntry?: string
    nodeEntry?: string
    notify?: boolean
    outputPath?: string
    preview?: boolean
    quiet?: boolean
    rootPath?: string
    runBuild?: boolean
    runCleanup?: boolean
    runTest?: boolean
    testScript?: string
    useYarn?: boolean
    verbose?: boolean
}