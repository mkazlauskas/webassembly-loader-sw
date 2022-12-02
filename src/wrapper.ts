import { TransformModuleOptions } from './options';

const createImportObject = (options: TransformModuleOptions): string => {
  return `{
    env: {
      memory: new WebAssembly.Memory(${JSON.stringify(
        options.memoryDescriptor
      )}),
      table: new WebAssembly.Table(${JSON.stringify(options.tableDescriptor)})
    },
    ${options.importObjectProps}
  }`;
};
// {
//             './cardano_multiplatform_lib_bg.js': __webpack_require__("../../node_modules/@dcspark/cardano-multiplatform-lib-browser/cardano_multiplatform_lib_bg.js"),
//           }
/** Wrap binary data as commonjs module so it can be imported by doing require(module)
 * @param buffer raw binary data to be wrapped as es6 module
 * @return chainable object which represent `wrap this data as...`
 * @example return wrap(arrayBuffer).asWebAssembly.Module
 */
export default function(buffer: Buffer, options: TransformModuleOptions) {
  const data = buffer.toJSON().data.toString();
  let exportString = 'module.exports ='; // if (module === 'cjs')

  if (options.module === 'esm') exportString = 'export default';

  return {
    asBuffer: `${exportString} Buffer.from([${data}])`,
    asWebAssembly: {
      Module: `${exportString} new WebAssembly.Module(
          Buffer.from([${data}])
        )`,
      Instance: `${exportString} new WebAssembly.Instance(
          new WebAssembly.Module(
            Buffer.from([${data}])
          ),
          ${createImportObject(options)}
        ).exports`
    },
    promiseWebAssembly: {
      Module: `${exportString} () => WebAssembly.compile(
          Buffer.from([${data}])
        )`,
      Instance: `${exportString} importObject => WebAssembly.instantiate(
          new WebAssembly.Module(Buffer.from([${data}])),
          importObject
        )`,
      Both: `${exportString} importObject => WebAssembly.instantiate(
            Buffer.from([${data}]), importObject
        )`
    }
  };
}
