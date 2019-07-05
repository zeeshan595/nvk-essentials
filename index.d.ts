/// <reference types="node" />
export interface Output {
    error: null | string;
    message?: string;
    output?: Uint8Array;
}
export declare enum TypeOfExtension {
    vert = "vert",
    tesc = "tesc",
    tese = "tese",
    geom = "geom",
    frag = "frag",
    comp = "comp",
    mesh = "mesh",
    task = "task",
    rgen = "rgen",
    rint = "rint",
    rahit = "rahit",
    rchit = "rchit",
    rmiss = "rmiss",
    rcall = "rcall",
    glsl = "glsl",
    hlsl = "hlsl"
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
