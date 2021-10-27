import React from "react";

export default function FormPart(props, name) {
  return (
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon3">
          {name}
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        id="text"
        required
        value={props.values.name}
        onChange={props.handleInputChange}
        name="props.name"
      />
    </div>
  );
}
