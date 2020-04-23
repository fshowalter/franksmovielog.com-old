import React, { ChangeEventHandler, ReactNode } from 'react';

import styled from '@emotion/styled';

const styleVars = {
  filterBackgroundColor: "#fff",
  filterBorderColor: "var(--color-primary)",
  filterSliderActiveHandleBackgroundColor: "#eaeaea",
  filterSliderBackgroundColor: "rgba(0, 0, 0, .02)",
  filterTextBoxColor: "var(--color-text-secondary)",
};

const Container = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  margin: 20px;
  transition: opacity 0.3s ease;
`;

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-primary);
  color: var(--color-accent);
  display: block;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 20px;
  padding: 20px;
  position: relative;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 0 20px;
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: ${styleVars.filterBackgroundColor};
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: ${styleVars.filterTextBoxColor};
  display: block;
  font-family: var(--font-family-system);
  font-size: 16px;
  padding: 0;
  width: 100%;
  ::placeholder {
    color: var(--color-text-hint);
    font-family: var(--font-family-system);
    font-size: 14px;
    font-weight: normal;
  }
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px $filter_border_color;
  margin-bottom: 8px;
  padding-bottom: 7px;
`;

const FilterControl = styled.div`
  margin-bottom: 35px;
`;

const Label = styled.label`
  color: var(--color-accent);
  display: block;
  font-size: 15px;
  font-weight: normal;
  line-height: 2.2;
`;

const SelectInput = styled.select`
  appearance: none;
  backface-visibility: hidden;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  display: block;
  font-family: var(--font-family-system);
  padding: 0;
  width: 100%;
  background-color: ${styleVars.filterBackgroundColor};
  color: ${styleVars.filterTextBoxColor};
  font-size: 15px;
  text-indent: 0.01px;
  text-overflow: "";
`;

interface SelectFilterProps {
  name: string;
  children: Array<[string, string]>;
}

const SelectFilter = ({ name, children }: SelectFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <SelectInput>
        {children.map(([name, value]) => {
          return (
            <option key={value} value={value}>
              {name}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
};

interface TextFilterProps {
  name: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const TextFilter = ({ name, placeholder, onChange }: TextFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <TextInputWrap>
        <TextInput onChange={onChange} name={name} placeholder={placeholder} />
      </TextInputWrap>
    </FilterControl>
  );
};

interface FilterPanelProps {
  heading: string;
  children: ReactNode;
}

const FilterPanel = ({ heading, children }: FilterPanelProps) => {
  return (
    <Container>
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </Container>
  );
};

export { FilterPanel, TextFilter, SelectFilter };
