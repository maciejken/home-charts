import React from "react";
import "./radio-group.css";

function RadioGroup({ buttons, name, onChange, defaultId }) {
    return (
      <div className="radio-group">
        {
          buttons.map((button) =>
            <RadioInput
              key={button.id}
              id={button.id}
              label={button.label}
              name={name}
              onClick={onChange}
              checked={button.id === defaultId}
            />
          )
        }
      </div>
    );
}

function RadioInput({ checked, id, label, name, onClick }) {
  return (
      <div className="radio-input">
        <input onClick={onClick} type="radio" id={id} name={name} checked={checked} />
        <label for={id}>{label}</label>
      </div>
  );
}

export { RadioGroup, RadioInput };
