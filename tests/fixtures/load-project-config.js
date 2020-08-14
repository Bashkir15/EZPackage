import { readJSON } from 'fs-extra'
import path from 'path'

export default function loadProjectConfig(dirPath) {
    return readJSON(path.join(dirPath, 'ez-config.json'))
}