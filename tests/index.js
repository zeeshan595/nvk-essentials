"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const index_1 = __importStar(require("../index"));
const vertexSrc = fs.readFileSync(`${__dirname}/shaders/basic.vert`);
const fragmentSrc = fs.readFileSync(`${__dirname}/shaders/basic.frag`);
const errors = [];
{
    const output = index_1.default.compileSync({
        source: vertexSrc,
        extension: index_1.TypeOfExtension.vert
    });
    if (output.error) {
        errors.push(output.error);
    }
}
{
    const output = index_1.default.compileSync({
        source: fragmentSrc,
        extension: index_1.TypeOfExtension.vert
    });
    if (output.error) {
        errors.push(output.error);
    }
}
if (errors.length > 0) {
    console.log(JSON.stringify(errors));
    console.error(`Tests failed! ${errors.length} errors`);
}
else {
    console.log(`All tests passed!`);
}
//# sourceMappingURL=index.js.map