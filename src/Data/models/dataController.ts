import DataModel from "./dataModel";
import TypeOfData from "./dataTypes";

export default class DataController<T> {
  private __structure: T;
  private __controllers: DataModel[];
  private __totalBytesLength: number;

  private parseObject = (data: any) => {
    Object.keys(data).forEach(key => {
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

  getTotalBytesLength = () => {
    return this.__totalBytesLength;
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