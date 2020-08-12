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
    packageJSON?: PackageJSON;
    paths: {
        config?: string;
        output?: ProjectOutput;
        root?: string;
    };
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
    cleanup?: boolean;
    contents?: string;
    enableTwoFactor?: boolean;
    preview?: boolean;
    releaseDraft?: boolean;
    // Make this actual valid release types
    releaseType?: string;
    skipTests?: boolean;
    tag?: string;
    testScript?: string;
};

export type ProjectConfig = BundleConfig & PublishConfig;
