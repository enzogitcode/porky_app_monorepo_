import React from 'react';

export type InputType = React.InputHTMLAttributes<HTMLInputElement>["type"];


interface InputProps {
  label?: string;
  value: string | number;
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void; 
  type:InputType |  'datetime-local';
  placeholder?: string;
  name?:string
  className?:string
  inputClassName?:string
  required?:boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}


const InputCustom: React.FC<InputProps> = ({ label, value, onChange, type, placeholder, name, className, inputClassName, required, onKeyDown }) => {
  
  return (
    <div className={`m-1 p-1${className ?? ""}`}>
      {label && <label htmlFor={label}>{label}</label>}
      <input
      className={`border-2 rounded-4xl ${inputClassName ?? ""}`}
      id={label}
      name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{ padding: '0.5rem', width: '100%' }}
        required={required}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default InputCustom;
