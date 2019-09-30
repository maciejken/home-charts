import React from "react";
import "./radio-group.css";

function RadioGroup({ buttons, name, onChange, value }) {
  return (
    <div className="radio-group">
      <div className="radio-label">
        {name.toUpperCase()}
      </div>
      {
        buttons.map((button) =>
          <RadioInput
            key={button.id}
            id={button.id}
            value={button.value}
            label={button.label}
            name={name}
            onClick={onChange}
            checked={button.value === value}
          />
        )
      }
    </div>
  );
}

function RadioInput({ id, checked, label, name, onClick, value }) {
  return (
      <div className={`radio-input ${checked ? 'checked' : ''}`}>
        <input onClick={onClick} type="radio" id={id} value={value} name={name} />
        <label for={id}>{label}</label>
      </div>
  );
}

export { RadioGroup, RadioInput };
