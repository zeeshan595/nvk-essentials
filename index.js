"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
let glslangPath = `${__dirname}/bin/${process.platform}/bin`;
if (process.platform === `linux` || process.platform === `darwin`) {
    fs.chmodSync(glslangPath, 755);
}
let version = child_process_1.execSync(`${glslangPath} -v`).toString();
;
var TypeOfExtension;
(function (TypeOfExtension) {
    TypeOfExtension["frag"] = "frag";
    TypeOfExtension["vert"] = "vert";
    TypeOfExtension["comp"] = "comp";
})(TypeOfExtension = exports.TypeOfExtension || (exports.TypeOfExtension = {}));
;
;
const executeAsync = (command) => {
    return new Promise((resolve, reject) => {
        child_process_1.exec(command, (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
};
const writeFileAsnyc = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, error => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};
const readFileAsync = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(new Uint8Array(data));
            }
        });
    });
};
const unlinkAsync = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, error => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};
const compileFile = (source, destination) => __awaiter(this, void 0, void 0, function* () {
    let data = {
        error: null
    };
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        data.message = yield executeAsync(cmd).toString();
    }
    catch (e) {
        data.error = e;
    }
    return data;
});
const compileFileSync = (source, destination) => {
    let data = {
        error: null
    };
    const destinationDir = destination.substring(0, destination.lastIndexOf('/'));
    fs.mkdirSync(destinationDir, { recursive: true });
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        data.message = child_process_1.execSync(cmd).toString();
    }
    catch (e) {
        data.error = e;
    }
    return data;
};
const compile = (input) => __awaiter(this, void 0, void 0, function* () {
    let data = {
        error: null
    };
    const source = `${__dirname}/temp.${input.extension}`;
    const destination = `${__dirname}/temp.spv`;
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        yield writeFileAsnyc(source, input.source);
        data.message = yield executeAsync(cmd).toString();
        data.output = yield readFileAsync(destination);
        yield unlinkAsync(source);
        yield unlinkAsync(destination);
    }
    catch (e) {
        data.error = e;
    }
    return data;
});
const compileSync = (input) => {
    let data = {
        error: null
    };
    const source = `${__dirname}/temp.${input.extension}`;
    const destination = `${__dirname}/temp.spv`;
    const cmd = `${glslangPath} -V ${source} -o ${destination}`;
    try {
        fs.writeFileSync(source, input.source);
        data.message = child_process_1.execSync(cmd).toString();
        data.output = new Uint8Array(fs.readFileSync(destination));
        fs.unlinkSync(source);
        fs.unlinkSync(destination);
    }
    catch (e) {
        data.error = e;
    }
    return data;
};
exports.default = {
    version,
    compileFile,
    compileFileSync,
    compile,
    compileSync
};
//# sourceMappingURL=index.js.map