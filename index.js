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
const execute = (command) => {
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
const compile = (source, destination) => __awaiter(this, void 0, void 0, function* () {
    let data = {
        error: null
    };
    const cmd = `${glslangPath} -V ${source} -o ${destination} -s`;
    try {
        data.message = yield execute(cmd).toString();
    }
    catch (e) {
        data.error = e;
    }
    return data;
});
const compileSync = (source, destination) => {
    let data = {
        error: null
    };
    const destinationDir = destination.substring(0, destination.lastIndexOf('/'));
    fs.mkdirSync(destinationDir, { recursive: true });
    const cmd = `${glslangPath} -V ${source} -o ${destination} -s`;
    try {
        data.message = child_process_1.execSync(cmd).toString();
    }
    catch (e) {
        data.error = e;
    }
    return data;
};
exports.default = {
    version,
    compile,
    compileSync
};
//# sourceMappingURL=index.js.map