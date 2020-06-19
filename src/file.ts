import { relative, sep } from 'path'

const esmRegex = /(^\s*|[}\);\n]\s*)(import\s*(['"]|(\*\s+as\s+)?(?!type)([^"'\(\)\n; ]+)\s*from\s*['"]|\{)|export\s+\*\s+from\s+["']|export\s*(\{|default|function|class|var|const|let|async\s+function))/,
  moduleGlob = ['**/*', '!node_modules', '!test']

export function isScript(code: string) {
  return !Boolean(code.match(esmRegex))
}

export function nodeModuleGlobs(file: Pick<File, 'package' | 'belongsTo'>, useDefault?: boolean): string[] {
  const normalGlobs = (file.package?.files || [])
    .concat([file.package?.pkg?.scripts || []])
    .concat([file.package?.pkg?.assets || []])
    .flat()

  return normalGlobs.length ? normalGlobs : useDefault ? moduleGlob : []
}

export type JsLoaderOptions = {
  loadContent: boolean
  isEntry: boolean
  context?: {
    moduleRoot: string
    package: any
    expanded?: boolean
    globs?: string[]
  }
  expand: 'all' | 'variable' | 'none'
}

export type FileMap = { [key: string]: File | null }
export interface File {
  deps: FileMap
  belongsTo?: File
  absPath: string
  contents: string | null
  contextExpanded?: boolean
  variableImports?: boolean
  moduleRoot?: string
  package?: any
}

const variableImports = false
const notNodeModule = /^\.|^\//

export function isNodeModule(request: string) {
  return !notNodeModule.test(request)
}

export function ensureDottedRelative(from: string, to: string) {
  let rel = relative(from, to)
  if (!rel.startsWith('.')) {
    rel = './' + rel
  }
  return rel.split(sep).join('/')
}

export function createFile(absPath: string): File {
  return {
    deps: {},
    absPath,
    contents: null,
    variableImports,
  }
}
