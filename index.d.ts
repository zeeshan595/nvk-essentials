/// <reference types="node" />
export interface Output {
    error: null | string;
    message?: string;
    output?: Uint8Array;
}
export declare enum TypeOfExtension {
    frag = "frag",
    vert = "vert",
    comp = "comp"
}
export interface Input {
    source: Buffer;
    extension: TypeOfExtension;
}
declare const _default: {
    version: string;
    compileFile: (source: string, destination: string) => Promise<Output>;
    compileFileSync: (source: string, destination: string) => Output;
    compile: (input: Input) => Promise<Output>;
    compileSync: (input: Input) => Output;
};
export default _default;
