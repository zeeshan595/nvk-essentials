import { DataHelper } from "../index";
import TypeOfData from "../DataHelper/models/dataTypes";
import { DataController, DataModel } from "../DataHelper/models/dataStructure";

const main = () => {
  const data = new DataController({
    test: [23, 43, 435], //By default every number gets converted to Float32Array
    test2: new DataModel([2, 2, 2], TypeOfData.Uint8) //Can specify the type using data controller
  });

  const myAwesomeArrayBuffer = data.getArrayBuffer();
  data.setArrayBuffer(myAwesomeArrayBuffer);

  data.setData({
    test: [23, 234, 34],
    test2: new DataModel([2, 2, 2], TypeOfData.Uint8)
  });
  const myData = data.getData();

  if (data !== myData as any) {
    console.error('data model test failed');
  } else {
    console.log('All tests passed!');
  }
}

export default main;