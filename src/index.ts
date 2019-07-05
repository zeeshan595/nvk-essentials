import * as fs from "fs";
import { execSync, exec } from "child_process";

let glslangPath = `${__dirname}/bin/${process.platform}/bin`;

if (process.platform === `linux` || process.platform === `darwin`) {
    fs.chmodSync(glslangPath, 755);
}

let version = execSync(`${glslangPath} -v`).toString();

export interface Output {
    error: null | string;
    message?: string;
    output?: Uint8Array;
};

export enum TypeOfExtension {
    frag = "frag",
    vert = "vert",
    comp = "comp"
};

export interface Input {
    source: Uint8Array;
    extension: TypeOfExtension
};

const executeAsync = (command: string) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

const writeFileAsnyc = (path: string, data: Uint8Array) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

const readFileAsync = (path: string): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(new Uint8Array(data));
            }
        });
    });
}

const unlinkAsync = (path: string) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    });
}

const compileFile = async (source: string, destination: string): Promise<Output> => {
    let data: Output = {
        error: null
    };
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        data.message = await executeAsync(cmd).toString();
    } catch (e) {
        data.error = e;
    }
    return data;
}

const compileFileSync = (source: string, destination: string): Output => {
    let data: Output = {
        error: null
    };
    const destinationDir = destination.substring(0, destination.lastIndexOf('/'));
    fs.mkdirSync(destinationDir, { recursive: true });
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        data.message = execSync(cmd).toString();
    } catch (e) {
        data.error = e;
    }
    return data;
}

const compile = async (input: Input): Promise<Output> => {
    let data: Output = {
        error: null
    };
    const source = `${__dirname}/temp.${input.extension}`;
    const destination = `${__dirname}/temp.spv`;
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        await writeFileAsnyc(source, input.source);
        data.message = await executeAsync(cmd).toString();
        data.output = await readFileAsync(destination);
        await unlinkAsync(source);
        await unlinkAsync(destination);
    } catch (e) {
        data.error = e;
    }
    return data;
}

const compileSync = (input: Input): Output => {
    let data: Output = {
        error: null
    };
    const source = `${__dirname}/temp.${input.extension}`;
    const destination = `${__dirname}/temp.spv`;
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        fs.writeFileSync(source, input.source);
        data.message = execSync(cmd).toString();
        data.output = new Uint8Array(fs.readFileSync(destination));
        fs.unlinkSync(source);
        fs.unlinkSync(destination);
    } catch (e) {
        data.error = e;
    }
    return data;
}

export default {
    version,
    compileFile,
    compileFileSync,
    compile,
    compileSync
}