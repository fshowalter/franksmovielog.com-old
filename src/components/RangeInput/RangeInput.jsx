import React from "react";
import ReactSlider from "react-slider";
import PropTypes from "prop-types";

function Thumb(props) {
  return (
    <div {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  );
}

function Track(props) {
  return (
    <div {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  );
}

export default function RangeFilter({ id, min, max, onChange }) {
  const initialState = [min, max];

  const [state, setState] = React.useState(initialState.slice());

  const valuesAreValid = (values) => {
    return (
      values[0] >= min &&
      values[0] <= values[1] &&
      values[0] >= min &&
      values[1] <= max
    );
  };

  const handleSliderUpdate = (values) => {
    if (!Array.isArray(values)) {
      return;
    }
    onChange(values);
  };

  const handleSliderChange = (values) => {
    if (!Array.isArray(values)) {
      return;
    }
    setState([...values]);
  };

  const handleMinChange = (value) => {
    const newState = [parseInt(value, 10), state[1]];
    setState(newState);

    if (valuesAreValid(newState)) {
      onChange(newState);
    }
  };

  const handleMaxChange = (value) => {
    const newState = [state[0], parseInt(value, 10)];
    setState(newState);

    if (valuesAreValid(newState)) {
      onChange(newState);
    }
  };

  return (
    <div id={id}>
      <ReactSlider
        max={max}
        min={min}
        renderTrack={Track}
        renderThumb={Thumb}
        onChange={handleSliderChange}
        onAfterChange={handleSliderUpdate}
        thumbActiveClassName="dragging"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={state[0]}
        step="1"
        onChange={(e) => handleMinChange(e.target.value)}
        className="filter-numeric min"
      />
      &nbsp;to&nbsp;
      <input
        type="number"
        value={state[1]}
        min={min}
        max={max}
        onChange={(e) => handleMaxChange(e.target.value)}
        step="1"
        className="filter-numeric max"
      />
    </div>
  );
}

RangeFilter.propTypes = {
  id: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
