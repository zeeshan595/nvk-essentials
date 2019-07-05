export interface Output {
    error: null | string;
    message?: string;
}
declare const _default: {
    version: string;
    compile: (source: string, destination: string) => Promise<Output>;
    compileSync: (source: string, destination: string) => Output;
};
export default _default;
