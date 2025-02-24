import { useState } from 'react'

import './SelectDropdown.css'


import {
  SelectOption,
} from '../models.tsx'

type SelectDropdownProps = {
  options: SelectOption[];
  onChange: (val: string | number | string[] | number[]) => void;
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, onChange }) => {

  const [value, setValue] = useState(null)

  return (
    <div className="select-dropdown-group">
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        className="select-dropdown"
      >
        <option key={''} value={null}>
            {'choose value'}
          </option>
        {options.map((option: SelectOption) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;