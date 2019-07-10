import * as fs from "fs";
import { GLSL } from "../index";

const main = () => {
  const vertexSrc = fs.readFileSync(`${__dirname}/../../src/tests/shaders/basic.vert`);
  const fragmentSrc = fs.readFileSync(`${__dirname}/../../src/tests/shaders/basic.frag`);

  const errors = [];

  {
    const output = GLSL.compileSync({
      source: vertexSrc,
      extension: GLSL.TypeOfExtension.vert
    });
    if (output.error) {
      errors.push(output.error);
    }
  }

  {
    const output = GLSL.compileSync({
      source: fragmentSrc,
      extension: GLSL.TypeOfExtension.vert
    });
    if (output.error) {
      errors.push(output.error);
    }
  }

  if (errors.length > 0) {
    console.log(JSON.stringify(errors));
    console.error(`Tests failed! ${errors.length} errors`);
  } else {
    console.log(`All tests passed!`);
  }
};

export default main;