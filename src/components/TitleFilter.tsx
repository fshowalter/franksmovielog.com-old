import React from "react";

import TextFilter from "./TextFilter";

interface TitleFilterItem {
  movie: {
    title: string;
  };
}

function escapeRegExp(str = ""): string {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

interface TitleFilterProps {
  label: string;
  placeholder: string;
  onChange(filterId: string, matcher: (item: TitleFilterItem) => boolean): void;
}

export default function TitleFilter({
  label,
  placeholder,
  onChange,
}: TitleFilterProps): JSX.Element {
  const handleChange = (value: string): void => {
    const regex = new RegExp(escapeRegExp(value), "i");
    onChange("title", (item: TitleFilterItem): boolean => {
      return regex.test(item.movie.title);
    });
  };

  return (
    <TextFilter
      label={label}
      placeholder={placeholder}
      handleChange={handleChange}
    />
  );
}
