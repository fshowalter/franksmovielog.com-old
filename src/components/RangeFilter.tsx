import React from "react";
import ReactSlider from "react-slider";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import FilterControl from "./FilterControl";
import Label from "./Label";

const RangeFilterWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const StyledSlider = styled(ReactSlider)`
  flex: 1 100%;
  height: 32px;
  width: 100%;
`;

const StyledThumb = styled.div`
  background-color: #fff;
  border: 1px solid var(--color-text-secondary);
  border-radius: 50%;
  cursor: grab;
  height: 2rem;
  left: -1rem;
  position: relative;
  top: 0;
  transition: transform 0.3s ease-in-out;
  width: 2rem;
  z-index: 1;

  &.dragging {
    transform: scale(1.25);
  }
`;

function Thumb(props: object): JSX.Element {
  return (
    <StyledThumb {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  );
}

const StyledTrack = styled.div`
  background: rgba(0, 0, 0, 0.06);
  border-bottom: solid 0.5rem #fff;
  border-top: solid 0.5rem #fff;
  height: 2rem;
  margin: auto 0.8rem;
  position: relative;

  @media only screen and (min-width: 35em) {
    border-color: #fff;
  }
`;

function Track(props: object): JSX.Element {
  return (
    <StyledTrack {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  );
}

const rangeInputMixin = css`
  appearance: textfield;
  background-color: #fff;
  border: 0;
  box-sizing: content-box;
  color: var(--color-text-primary);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.2rem;
  padding: 0;
  width: 25%;
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
  width: 3rem;
  @media (min-width: 50em) {
    height: 1.4rem;
    line-height: 1.4rem;
  }
`;

const RangeInputMin = styled.input`
  ${rangeInputMixin}
  margin-right: auto;
`;

const RangeInputMax = styled.input`
  ${rangeInputMixin}
  align-self: flex-start;
  text-align: right;
`;

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  handleChange(value: number[]): void;
}

export default function RangeFilter({
  label,
  min,
  max,
  handleChange,
}: RangeFilterProps): JSX.Element {
  const initialState = [min, max];

  const [state, setState] = React.useState(initialState.slice());

  const valuesAreValid = (values: number[]): boolean => {
    return (
      values[0] < values[1] &&
      values[0] >= initialState[0] &&
      values[1] <= initialState[1]
    );
  };

  const handleSliderUpdate = (
    values: number | number[] | null | undefined
  ): void => {
    if (!Array.isArray(values)) {
      return;
    }
    handleChange(values);
  };

  const handleSliderChange = (
    values: number | number[] | null | undefined
  ): void => {
    if (!Array.isArray(values)) {
      return;
    }
    setState([...values]);
  };

  const handleMinChange = (value: string): void => {
    const newState = [parseInt(value, 10), state[1]];
    setState(newState);

    if (valuesAreValid(newState)) {
      handleChange(newState);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newState = [state[0], parseInt(value, 10)];
    setState(newState);

    if (valuesAreValid(newState)) {
      handleChange(newState);
    }
  };

  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <RangeFilterWrap>
        <StyledSlider
          value={state}
          max={max}
          min={min}
          renderTrack={Track}
          renderThumb={Thumb}
          onChange={handleSliderChange}
          onAfterChange={handleSliderUpdate}
          thumbActiveClassName="dragging"
        />
        <RangeInputMin
          type="number"
          value={state[0]}
          min={min}
          max={max}
          step="1"
          onChange={(e): void => handleMinChange(e.target.value)}
          className="filter-numeric min"
        />
        <RangeInputMax
          type="number"
          value={state[1]}
          min={min}
          max={max}
          onChange={(e): void => handleMaxChange(e.target.value)}
          step="1"
          className="filter-numeric max"
        />
      </RangeFilterWrap>
    </FilterControl>
  );
}
