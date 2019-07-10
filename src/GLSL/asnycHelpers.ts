import * as fs from "fs";
import { exec } from "child_process";

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

const writeFileAsnyc = (path: string, data: Buffer) => {
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

export {
  executeAsync,
  writeFileAsnyc,
  readFileAsync,
  unlinkAsync
};