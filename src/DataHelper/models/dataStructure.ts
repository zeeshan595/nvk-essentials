import TypeOfData, { getDataByteLength } from "./dataTypes";

export class DataModel {
  private __type: TypeOfData;
  private __length: number;
  private __bytesLength: number;
  private __totalBytesLength: number;
  private __data: ArrayBuffer;

  constructor(data: number[], type: TypeOfData = TypeOfData.Float32) {
    this.__type = type;
    this.__length = data.length;
    this.__bytesLength = getDataByteLength(type);
    this.__totalBytesLength = data.length * this.__bytesLength;
    this.__data = new ArrayBuffer(this.__totalBytesLength);
    this.setData(data);
  }

  resize = (newLength: number, keepData: boolean = true): void => {
    let oldData: number[] = [];
    if (keepData)
      oldData = this.getData(0, "max", true) as number[];

    let smallestLength = newLength;
    if (this.__length < smallestLength) {
      smallestLength = this.__length;
    }

    this.__length = newLength;
    this.__totalBytesLength = this.__bytesLength * this.__length;
    this.__data = new ArrayBuffer(this.__totalBytesLength);
    if (keepData)
      this.setData(oldData, 0);
  }

  getData = (offset: number = 0, length: number | "max" = "max", forceArray: boolean = false): number[] | number => {
    if (length === "max")
      length = this.__length - offset;

    const data: number[] = [];
    const view = new DataView(this.__data, offset * this.__bytesLength, length * this.__bytesLength);
    for (let i = 0; i < length; i++) {
      switch (this.__type) {
        case TypeOfData.Int8:
          data[i] = view.getInt8(i * this.__bytesLength);
          break;
        case TypeOfData.Uint8:
          data[i] = view.getUint8(i * this.__bytesLength);
          break;
        case TypeOfData.Uint16:
          data[i] = view.getUint8(i * this.__bytesLength);
          break;
        case TypeOfData.Int16:
          data[i] = view.getInt16(i * this.__bytesLength);
          break;
        case TypeOfData.Uint32:
          data[i] = view.getUint8(i * this.__bytesLength);
          break;
        case TypeOfData.Int32:
          data[i] = view.getInt32(i * this.__bytesLength);
          break;
        case TypeOfData.Float32:
          data[i] = view.getFloat32(i * this.__bytesLength);
          break;
        case TypeOfData.Float64:
          data[i] = view.getFloat64(i * this.__bytesLength);
          break;
        default:
          throw "this type of data is not supported";
      }
    }

    if (!forceArray) {
      if (data.length === 1) {
        return data[0];
      }
    }
    return data;
  }

  setData = (data: number[], offset: number = 0): void => {
    if (offset + data.length > this.__length)
      throw `data length does not match DataController, please resize the controller before setting the data`;

    const view = new DataView(this.__data, offset * this.__bytesLength, data.length * this.__bytesLength);
    for (let i = 0; i < data.length; i++) {
      switch (this.__type) {
        case TypeOfData.Int8:
          view.setInt8(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Uint8:
          view.setUint8(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Uint16:
          view.setUint8(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Int16:
          view.setInt16(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Uint32:
          view.setUint8(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Int32:
          view.setInt32(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Float32:
          view.setFloat32(i * this.__bytesLength, data[i]);
          break;
        case TypeOfData.Float64:
          view.setFloat64(i * this.__bytesLength, data[i]);
          break;
        default:
          throw "this type of data is not supported";
      }
    }
  }

  getFormat = (): number => {
    return this.__type;
  }
  getTotalBytesLength = (): number => {
    return this.__totalBytesLength;
  }

  getArrayBuffer = (): ArrayBuffer => {
    return this.__data;
  }
  setArrayBuffer = (data: ArrayBuffer) => {
    if (data.byteLength !== this.__totalBytesLength) {
      throw `data bytes length does not match`;
    }
    if ((this.__bytesLength / data.byteLength) % 1 === 0) {
      throw `data provided is not in the correct format, please use TypeOfData to get the correct format`;
    }
    this.__data = data.slice(0);
  }
  setArrayBufferUsingView = (view: DataView) => {
    if (view.byteLength > this.__totalBytesLength) {
      throw `view provided is bigger than the array buffer`;
    }

    const myView = new DataView(this.__data);
    for (let i = 0; i < view.byteLength; i++) {
      myView.setInt8(i, view.getInt8(i));
    }
  }
}

export class DataController<T> {
  private __structure: T;
  private __controllers: DataModel[];
  private __totalBytesLength: number;

  private parseObject = (data: any) => {
    Object.keys(data).forEach(key => {
      if (key[0] == "_") {
        throw `object key's cannot start with _`;
      }
      const entry: any = data[key];
      if (entry instanceof DataModel) {
        this.__controllers.push(entry);
        this.__totalBytesLength += entry.getTotalBytesLength();
      } else if (Array.isArray(entry) && entry.length > 0 && typeof entry[0] === "number") {
        const c = new DataModel(entry as number[], TypeOfData.Float32);
        this.__controllers.push(c)
        this.__totalBytesLength += c.getTotalBytesLength();
      } else if (typeof entry === "number") {
        this.__controllers.push(new DataModel([entry], TypeOfData.Float32))
        this.__totalBytesLength += 4;
      } else if (typeof entry === "object") {
        this.parseObject(entry);
      } else {
        throw `Only javascript objects and DataControllers are supported in DataStructure`;
      }
    });
  }

  private parsedFetch = (structure: any, offset: number = 0): any => {
    let data: any = {};
    Object.keys(structure).forEach(key => {
      const controller = this.__controllers[offset];
      const entry = structure[key];
      if (entry instanceof DataModel) {
        data[key] = controller.getData();
        offset++;
      } else if (Array.isArray(entry) && entry.length > 0 && typeof entry[0] === "number") {
        data[key] = controller.getData();
        offset++;
      } else if (typeof entry === "number") {
        data[key] = controller.getData();
        offset++;
      } else {
        data[key] = this.parsedFetch(entry, offset);
      }
    });
    return data;
  }

  constructor(data: T) {
    this.__structure = data;
    this.__controllers = [];
    this.__totalBytesLength = 0;
    this.parseObject(data);
  }

  getData = (): T => {
    return this.parsedFetch(this.__structure);
  }
  setData = (data: T) => {
    this.__structure = data;
    this.__controllers = [];
    this.__totalBytesLength = 0;
    this.parseObject(data);
  }
  getArrayBuffer = (): ArrayBuffer => {
    const buffer = new ArrayBuffer(this.__totalBytesLength);
    const view = new DataView(buffer);
    let offset: number = 0;

    this.__controllers.forEach(controller => {
      const temp = controller.getArrayBuffer();
      const tempView = new DataView(temp);
      for (let i = 0; i < controller.getTotalBytesLength(); i++) {
        view.setInt8(offset + i, tempView.getInt8(i));
      }
    });
    return buffer;
  }
  setArrayBuffer = (data: ArrayBuffer): void => {
    if (data.byteLength != this.__totalBytesLength) {
      throw `data length does not match array buffer size`;
    }
    let offset: number = 0;

    this.__controllers.forEach(controller => {
      const view = new DataView(data, offset, controller.getTotalBytesLength());
      controller.setArrayBufferUsingView(view);
      offset += controller.getTotalBytesLength();
    });
  }
}