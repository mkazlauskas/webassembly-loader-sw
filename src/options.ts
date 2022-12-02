import * as path from 'path';
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema';
import tsconfig from '../tsconfig.json';

export type WebAssemblyLoaderExportType =
  | 'buffer'
  | 'instance'
  | 'module'
  | 'async'
  | 'async-instance'
  | 'async-module';

export interface WebAssemblyLoaderOptions {
  export?: WebAssemblyLoaderExportType;
  importObjectProps?: string;
  tableDescriptor?: WebAssembly.TableDescriptor;
  memoryDescriptor?: WebAssembly.MemoryDescriptor;
}

// bear in mind this is ran from dist
const program = getProgramFromFiles(
  [path.resolve(__dirname, '../types/options.d.ts')],
  tsconfig.compilerOptions,
  path.resolve(__dirname, '..')
);

export const schema = generateSchema(program, 'WebAssemblyLoaderOptions', {
  noExtraProps: true
});

export type ModuleType = 'cjs' | 'esm';

export interface TransformModuleOptions
  extends Required<WebAssemblyLoaderOptions> {
  errorHandler?: (message: string) => void | never;
  module?: ModuleType;
}
