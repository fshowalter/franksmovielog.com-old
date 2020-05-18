import React from "react";

import styled from "@emotion/styled";

import FilterControl from "./FilterControl";
import Label from "./Label";

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: var(--color-text-secondary);
  display: block;
  font-family: var(--font-family-system);
  font-size: 16px;
  padding: 0;
  width: 100%;
  ::placeholder {
    color: var(--color-text-secondary);
    font-family: var(--font-family-system);
    font-size: 14px;
    font-weight: normal;
  }
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-border);
  margin-bottom: 8px;
  padding-bottom: 7px;
`;

const delay = (
  func: Function,
  wait: number,
  ...args: unknown[]
): NodeJS.Timeout => {
  return setTimeout(function delayWrap() {
    return func(...args);
  }, wait);
};

function underscoreDebounce(
  func: Function,
  wait: number
): (...args: unknown[]) => void {
  let result: unknown;
  let timeout: NodeJS.Timeout | null = null;

  const later = function later(context: Function, args: unknown): void {
    timeout = null;
    if (args) {
      result = func.apply(context, args);
    }
  };

  return function debouncedFunction(...args): unknown {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = delay(later, wait, null, args);
    return result;
  };
}

interface TextFilterProps {
  label: string;
  placeholder: string;
  handleChange(value: string): void;
}

export default function TextFilter({
  label,
  placeholder,
  handleChange,
}: TextFilterProps): JSX.Element {
  const debouncedHandleChange = underscoreDebounce(handleChange, 150);
  const slugLabel = label.toLowerCase().replace(" ", "-");

  return (
    <FilterControl>
      <Label htmlFor={slugLabel}>{label}</Label>
      <TextInputWrap>
        <TextInput
          id={slugLabel}
          placeholder={placeholder}
          onChange={(e): void => debouncedHandleChange(e.target.value)}
        />
      </TextInputWrap>
    </FilterControl>
  );
}
