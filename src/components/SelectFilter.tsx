import React from "react";

import FilterControl from "./FilterControl";
import Label from "./Label";
import SelectInput from "./SelectInput";

interface SelectFilterProps {
  label: string;
  children: Array<[string, string]>;
  onChange: (value: string) => void;
}

export default function SelectFilter({
  label,
  children,
  onChange,
}: SelectFilterProps): JSX.Element {
  const options = [
    <option key="all">All</option>,
    ...children.map(([optionName, optionValue]) => {
      return (
        <option key={optionValue} value={optionValue}>
          {optionName}
        </option>
      );
    }),
  ];

  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <SelectInput
        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
          onChange(e.target.value)
        }
      >
        {options}
      </SelectInput>
    </FilterControl>
  );
}
