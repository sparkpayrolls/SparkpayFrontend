import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { IRangeInput } from '../types';

export const RangeInput = (props: IRangeInput) => {
  return (
    <div className="range-input">
      <label>{props.label}</label>
      <InputRange {...props} />
    </div>
  );
};
