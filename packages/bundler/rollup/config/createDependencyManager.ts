import * as builtinModules from 'builtin-modules'
import * as path from 'path'

const BuiltIns = new Set(builtinModules)

export default function createDependencyManager({ dependencies, input }) {
    const dependencyState = {
        globalized: new Set(),
        inlined: new Set(),
        required: new Set()
    }

    function isRelativeDependency(dep) {
        return (/^\./).exec(dep)
    }

    function isVirtualRollupFile(file) {
        return (/\0/).exec(file)
    }

    function dependencyToPackageName(dep: string): string {
        if (!dep.includes('/')) return dep

        const isScoped = dep.startsWith('@')
        return dep
            .split('/')
            .slice(0, isScoped ? 2 : 1)
            .join('/')
    }

    function importerToPackageName(file: string): string {
        if (file.endsWith('?commonjs-external')) {
            return file.slice(0, -18)
        }

        const relativePath = path.relative(process.cwd(), file)
        // Local file path - simplified to '.'
        if (!(/node_modules/).exec(relativePath)) {
            return '.'
        }

        const [_, packageName] = relativePath.split(/\\|\//)
        return packageName
    }

    function shouldInlineDependency(passedDep: string, importer: string): boolean {
        const packageName = dependencyToPackageName(passedDep)
        // If it is listed in runtime or peer dependencies then we assume
        // the owner does not want to bundle it
        if (dependencies.runtime.has(packageName) || dependencies.peer.has(packageName)) {
            if (!dependencyState.required.has(packageName)) {
                dependencyState.required.add(packageName)
            }
            return false
        }

        // If the dependency is a dev one, then we assume it will not be required
        // during runtime. To make this possible we need to inline it
        if (dependencies.development.has(packageName)) {
            if (!dependencyState.inlined.has(packageName)) {
                dependencyState.inlined.add(packageName)
            }
            return true
        }

        // Continue processing Virtual Files (Rollup uses these during processing)
        if (isVirtualRollupFile(importer)) {
            return true
        }

        // If the package is not listed in any of the dependencies we assume that it is
        // some kind of globally available package. We do not bundle these
        const importerName = importerToPackageName(importer)
        if (importerName === '.') {
            if (!dependencyState.globalized.has(packageName)) {
                dependencyState.globalized.add(packageName)
            }
            return false
        }

        return true
    }

    return function manageDependency(dependency: string, importer: string): boolean {
        const inlineDependency = dependency === input || isRelativeDependency(dependency) || path.isAbsolute(dependency)
        if (!inlineDependency) {
            if (!BuiltIns.has(dependency)) {
                if (shouldInlineDependency(dependency, importer)) {
                    return false
                }
            }
        }
        return !inlineDependency
    }
}