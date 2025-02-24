import { useState } from 'react'

import './MultiSelect.css'

import {
  SelectOption,
} from '../models.tsx'

interface MultiSelectProps{
  options: SelectOption[];
  onChange: (x: string | number | string[] | number[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, onChange }) => {
  const [values, setValues] = useState([])
  return (
    <div className="multi-select-group">
      {options.map((option: SelectOption) => (
        <label key={option.key} className="multi-select-label">
          <input
            type="checkbox"
            value={option.key}
            checked={values.includes(option.key)}
            onChange={() => {
              var newValues = []
              if (values.includes(option.key)) {
                newValues = values.filter((v) => v !== option.key)
              } else {
                newValues = [...values, option.key]
              }
              setValues(newValues)
              onChange(newValues);
            }}
            className="multi-select-input"
          />
          <span className="multi-select-custom" />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default MultiSelect;
