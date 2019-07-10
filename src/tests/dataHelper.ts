import { DataHelper } from "../index";
import TypeOfData from "../DataHelper/models/dataTypes";
import { DataStructure, DataController } from "../DataHelper/models/dataStructure";

const main = () => {
  const model = new DataHelper.DataModel();

  const e = new DataStructure({
    test3: [23, 43, 435]
  });
  const helloWorld = e.getData();
  console.log(JSON.stringify(helloWorld));
}

export default main;