import {TextArea} from '../types';


export const TextAreaAll = (props: TextArea) => {
  return (
      <textarea
        placeholder={props.placeholder}
        className="textarea__container"
        error={props.error}
      />
  );
};
  