import { useState } from 'react'

import './TextInput.css'

type TextProps = {
  onChange: (val: string | number | string[] | number[]) => void;
};

const TextInput: React.FC<TextProps> = ({ onChange }) => {

  return (
    <div className="text-input-group">
    <input
      type="text"
      onChange={(e) => onChange(e.target.value)}
      className="text-input"
    />
  </div>
  );
};

export default TextInput;
