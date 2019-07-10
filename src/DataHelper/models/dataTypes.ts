enum TypeOfData {
  Int8,
  Uint8,
  Int16,
  Uint16,
  Int32,
  Uint32,
  Float32,
  Float64,
  Structure
};
export default TypeOfData;

export const getDataByteLength = (type: TypeOfData): number => {
  switch (type) {
    case TypeOfData.Int8:
    case TypeOfData.Uint8:
      return 1;
    case TypeOfData.Uint16:
    case TypeOfData.Int16:
      return 2;
    case TypeOfData.Uint32:
    case TypeOfData.Int32:
    case TypeOfData.Float32:
      return 4;
    case TypeOfData.Float64:
      return 8;
    default:
      throw "this type of data is not supported";
  }
}