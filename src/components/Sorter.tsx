import React from "react";

import FilterControl from "./FilterControl";
import Label from "./Label";
import SelectInput from "./SelectInput";

interface SorterProps<T> {
  label: string;
  children: { [key: string]: (a: T, b: T) => number };
  collection: T[];
  onChange: (collection: T[]) => void;
}

export const collator = new Intl.Collator("en", {
  sensitivity: "base",
  ignorePunctuation: true,
  numeric: true,
});

export function sortStringAsc(a: string, b: string): number {
  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
}

export function sortStringDesc(a: string, b: string): number {
  return -1 * sortStringAsc(a, b);
}

export default function Sorter<T>({
  label,
  children,
  collection,
  onChange,
}: SorterProps<T>): JSX.Element {
  const handleChange = (value: string): void => {
    const comparer = children[value];

    const sortedCollection = collection.sort(comparer);

    onChange(sortedCollection);
  };

  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <SelectInput
        name={label}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
          handleChange(e.target.value)
        }
      >
        {Object.keys(children).map((optionName) => {
          return (
            <option key={optionName} value={optionName}>
              {optionName}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
}
