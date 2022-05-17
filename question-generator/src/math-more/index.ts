import { FixedLengthArray } from 'type-fest';
import Vector, { getMagnitude } from './Vector';

const MathMore = {
  Vector,
  vector: function vector<dims extends number = number>(
    dims: dims,
    values: FixedLengthArray<number, dims>
  ) {
    return new Vector(dims, values);
  },
  getMagnitude,
};

export default MathMore;
