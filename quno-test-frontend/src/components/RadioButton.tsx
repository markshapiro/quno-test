import { useState } from 'react'

import './RadioButton.css'

import {
  SelectOption,
} from '../models.tsx'

type RadioButtonProps = {
  options: SelectOption[];
  onChange: (val: string | number | string[] | number[]) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ options, onChange }) => {
  const [value, setValue] = useState(null)
  return (
    <div className="radio-group">
      {options.map((option: SelectOption) => (
        <label key={option.key} className="radio-label">
          <input
            type="radio"
            value={value}
            checked={value === option.key}
            onChange={() => {
              setValue(option.key)
              onChange(option.key)
            }}
            className="radio-input"
          />
          <span className="radio-custom" />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButton;