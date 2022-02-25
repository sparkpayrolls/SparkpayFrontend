import {TextArea} from '../types';


export const TextAreaAll = (props: TextArea) => {
  return (
    <div className='textarea'>
      <textarea
        placeholder={props.placeholder}
        className="textarea__textarea-body"
        error={props.error}
        label={props.label}
      />
      </div>
  );
};
  