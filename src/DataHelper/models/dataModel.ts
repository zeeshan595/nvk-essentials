import TypeOfData, { getDataByteLength } from "./dataTypes";

export default class DataModel {
  private buffer: ArrayBuffer;

  private increaseSize = (newSize: number) => {
    if (newSize < this.buffer.byteLength) {
      throw `new array buffer size is smaller than old array buffer size`;
    } else if (newSize == this.buffer.byteLength) {
      return;
    }

    const newSizeArray = new ArrayBuffer(newSize);
    const newView = new DataView(newSizeArray);
    const oldView = new DataView(this.buffer);

    for (let i = 0; i < oldView.byteLength; i++) {
      newView.setInt8(i, oldView.getInt8(i));
    }
    this.buffer = newSizeArray;
  }
  private constructData = (data: ArrayBuffer, structure: any, bytesOffset: number, rw: "read" | "write" = "read") => {
    const view = new DataView(data, bytesOffset);
    let cursor = 0;
    Object.keys(structure).forEach(key => {
      if (key && key[0] === "_") return;
      const length: number = structure[`_l${key}`];
      const bytesLength: number = structure[`_bl${key}`];
      const type: TypeOfData = structure[`_t${key}`];

      if (!bytesLength && !length) return;

      switch (type) {
        case TypeOfData.Int8:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getInt8(cursor);
            } else {
              view.setInt8(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Int16:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getInt16(cursor);
            } else {
              view.setInt16(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Int32:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getInt32(cursor);
            } else {
              view.setInt32(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Uint8:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getUint8(cursor);
            } else {
              view.setUint8(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Uint16:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getUint16(cursor);
            } else {
              view.setUint16(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Uint32:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getUint32(cursor);
            } else {
              view.setUint32(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Float32:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getFloat32(cursor);
            } else {
              view.setFloat32(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Float64:
          for (let i = 0; i < length; i++) {
            if (rw === "read") {
              structure[key][i] = view.getFloat64(cursor);
            } else {
              view.setFloat64(cursor, structure[key][i]);
            }
          }
          break;
        case TypeOfData.Structure:
          structure[key] = this.constructData(data, structure[key], cursor + bytesOffset, rw);
          break;
        default:
          throw "this type of data is not supported"
      }
      cursor += bytesLength;
    });

    return structure;
  }

  constructor() {
    this.buffer = new ArrayBuffer(0);
  }

  getArrayBuffer = () => {
    return this.buffer;
  }

  push = (data: number[], type: TypeOfData) => {
    const bytesLength = getDataByteLength(type);
    const totalBytesLength = bytesLength * data.length;
    const oldLength = this.buffer.byteLength;
    const newLength = oldLength + totalBytesLength;

    this.increaseSize(newLength);
    const view = new DataView(this.buffer, oldLength, newLength);
    for (let i = 0; i < data.length; i++) {
      switch (type) {
        case TypeOfData.Int8:
          view.setInt8(i * bytesLength, data[i]);
          break;
        case TypeOfData.Int16:
          view.setInt16(i * bytesLength, data[i]);
          break;
        case TypeOfData.Int32:
          view.setInt32(i * bytesLength, data[i]);
          break;
        case TypeOfData.Uint8:
          view.setUint8(i * bytesLength, data[i]);
          break;
        case TypeOfData.Uint16:
          view.setUint16(i * bytesLength, data[i]);
          break;
        case TypeOfData.Uint32:
          view.setUint32(i * bytesLength, data[i]);
          break;
        case TypeOfData.Float32:
          view.setFloat32(i * bytesLength, data[i]);
          break;
        case TypeOfData.Float64:
          view.setFloat64(i * bytesLength, data[i]);
          break;
        default:
          throw "this type of data is not supported";
      }
    }
  }

  slice = (begin: number, end?: number) => {
    this.buffer = this.buffer.slice(begin, end);
  }

  toArrayBuffer = (structure: any): void => {
    this.constructData(this.buffer, structure, 0, "write");
  }

  fromArrayBuffer = (structure: any): any => {
    return this.constructData(this.buffer, structure, 0, "read");
  }
};