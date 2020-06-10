import React from "react";

import styled from "@emotion/styled";

import FilterControl from "./FilterControl";
import Label from "./Label";

const TextInput = styled.input``;

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
    <>
      <Label htmlFor={slugLabel}>{label}</Label>
      <TextInput
        id={slugLabel}
        placeholder={placeholder}
        onChange={(e): void => debouncedHandleChange(e.target.value)}
      />
    </>
  );
}
