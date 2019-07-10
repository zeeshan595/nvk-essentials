import { DataHelper } from "../index";
import TypeOfData from "../DataHelper/models/dataTypes";
import DataStructure from "../DataHelper/models/dataStructure";

const main = () => {
  const model = new DataHelper.DataModel();

  const entity = {
    _bltransform: 39,
    _ttransform: TypeOfData.Structure,
    transform: {
      _lposition: 3,
      _blposition: 12,
      _tposition: TypeOfData.Float32,
      position: [0, 0, 0],
      _lrotation: 4,
      _blrotation: 15,
      _trotation: TypeOfData.Float32,
      rotation: [0, 0, 0, 0],
      _lscale: 3,
      _blscale: 12,
      _tscale: TypeOfData.Float32,
      scale: [0, 0, 0]
    }
  };

  const e = new DataStructure({
    transform: {
      position: new DataStructure([0, 0, 0], TypeOfData.Float32),
      rotation: new DataStructure([0, 0, 0, 0], TypeOfData.Float32),
      scalre: new DataStructure([0, 0, 0], TypeOfData.Float32)
    }
  })

  model.toArrayBuffer(entity);
  const output = model.fromArrayBuffer(entity);
  console.log(output);
}

export default main;