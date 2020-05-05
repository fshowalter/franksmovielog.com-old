import { graphql } from "gatsby";
import parse from "html-react-parser";
import marked from "marked";
import React, { ReactNode } from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import Layout from "../components/Layout";

const PanelHeader = styled.header`
  padding: 35px 20px 20px;
  text-align: center;

  @media only screen and (min-width: 50em) {
    margin: 20px;
    padding: 20px;
    text-align: left;
  }
`;

const PanelHeading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const PanelSlug = styled.div`
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 0;
`;

interface PanelHeaderProps {
  title: string;
  slug: string;
}

const PanelHead = React.memo(({ title, slug }: PanelHeaderProps) => {
  return (
    <PanelHeader>
      <PanelHeading>{title}</PanelHeading>
      <PanelSlug>{slug}</PanelSlug>
    </PanelHeader>
  );
});

const List = styled.ol`
  margin: 0 0 35px;
  padding: 0;

  @media only screen and (min-width: 50em) {
    margin-top: 24px;
  }
`;

const ListItem = React.memo(styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: var(--color-primary);
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 20px;
    margin: 0;
    position: absolute;
    right: 0;
  }
`);

const Title = styled.div`
  display: block;
  font-size: 18px;
  line-height: 40px;
  overflow: hidden;
  padding: 20px 20px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Slug = styled.div`
  color: var(--color-text-hint);
  font-size: 15px;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;
`;

interface WatchlistPerson {
  fullName: string;
}

const formatPeople = (
  people: Array<WatchlistPerson>,
  suffix: string
): string => {
  if (people.length === 0) {
    return "";
  }
  const names = people.map((person) => person.fullName);

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `${formattedNames} ${suffix}`;
};

interface WatchlistCollection {
  name: string;
}

const formatCollections = (collections: Array<WatchlistCollection>): string => {
  if (collections.length === 0) {
    return "";
  }

  const names = collections.map((collection) => collection.name);

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `it's a ${formattedNames} film`;
};

const styleVars = {
  filterBackgroundColor: "#fff",
  filterBorderColor: "var(--color-primary)",
  filterSliderActiveHandleBackgroundColor: "#eaeaea",
  filterSliderBackgroundColor: "rgba(0, 0, 0, .02)",
  filterTextBoxColor: "var(--color-text-secondary)",
};

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
  outline: none;
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
  border-bottom: solid 1px var(--color-primary);
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
  background-color: ${styleVars.filterBackgroundColor};
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: ${styleVars.filterTextBoxColor};
  display: block;
  font-family: var(--font-family-system);
  font-size: 15px;
  padding: 0;
  text-indent: 0.01px;
  text-overflow: "";
  width: 100%;
`;

const FiltersWrap = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  margin: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .js-filters & {
    opacity: 1;
  }
`;

const RangeFilterWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  .noUi-target * {
    background-color: rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
    cursor: default;
    touch-action: none;
    -webkit-touch-callout: none;
    transition: transform 0.3s ease-in-out;
    user-select: none;
  }

  .noUi-active {
    background-color: #eaeaea;
    box-shadow: inset 0 0 5px var(--color-primary);
  }

  .noUi-state-drag .noUi-active {
    transform: scale(1.25);
  }

  .noUi-base {
    background: rgba(0, 0, 0, 0.02);
    border-bottom: solid 0.5rem #fff;
    border-top: solid 0.5rem #fff;
    height: 2rem;
    margin: auto 0.8rem;
    position: relative;

    @media only screen and (min-width: 35em) {
      border-color: #fff;
    }
  }

  .noUi-handle {
    background-color: #fff;
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    height: 2rem;
    left: -1rem;
    position: relative;
    top: -0.5rem;
    width: 2rem;
    z-index: 1;
  }

  .noUiSlider {
    flex: 1 100%;
  }

  .noUi-origin {
    border-radius: inherit;
    bottom: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .noUi-stacking .noUi-handle {
    z-index: 10;
  }
`;

const rangeInputMixin = css`
  appearance: textfield;
  background-color: #fff;
  border: 0;
  box-sizing: content-box;
  color: var(--color-text-secondary);
  font-family: var(--font-family-system);
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
  name: string;
  attribute: string;
  min: string;
  max: string;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  name,
  attribute,
  min,
  max,
}: RangeFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <RangeFilterWrap
        data-filter-attribute={attribute}
        data-filter-type="range"
        data-filter-min-value={min}
        data-filter-max-value={max}
      >
        <div className="noUiSlider noUi-target">
          <div className="noUi-base noUi-background noUi-horizontal">
            <div
              className="noUi-origin noUi-origin-lower"
              style={{ left: "0%" }}
            >
              <div className="noUi-handle noUi-handle-lower" />
            </div>
            <div
              className="noUi-origin noUi-origin-upper"
              style={{ left: "100%" }}
            >
              <div className="noUi-handle noUi-handle-upper" />
            </div>
          </div>
        </div>
        <RangeInputMin
          type="number"
          defaultValue={min}
          min={min}
          max={max}
          step="1"
          className="filter-numeric min"
        />
        <RangeInputMax
          type="number"
          defaultValue={max}
          min={min}
          max={max}
          step="1"
          className="filter-numeric max"
        />
      </RangeFilterWrap>
    </FilterControl>
  );
};

interface TextFilterProps {
  label: string;
  placeholder: string;
  filterAttribute: string;
}

const TextFilter: React.FC<TextFilterProps> = ({
  label,
  placeholder,
  filterAttribute,
}: TextFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <TextInputWrap>
        <TextInput
          name={label}
          placeholder={placeholder}
          data-filter-type="text"
          data-filter-attribute={filterAttribute}
        />
      </TextInputWrap>
    </FilterControl>
  );
};

interface FilterPanelProps {
  heading: string;
  children: ReactNode;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  heading,
  children,
}: FilterPanelProps) => {
  return (
    <FiltersWrap data-filter-controls data-target="#watchlist-titles">
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </FiltersWrap>
  );
};

interface SorterProps {
  name: string;
  children: Array<[string, string]>;
  target: string;
}

const Sorter: React.FC<SorterProps> = ({
  name,
  children,
  target,
}: SorterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <SelectInput
        name={name}
        data-sorter={children[0][1]}
        data-target={target}
      >
        {children.map(([optionName, optionValue]) => {
          return (
            <option key={optionName} value={optionValue}>
              {name}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
};

interface Props {
  location: WindowLocation;
  data: {
    page: {
      slug: string;
      date: string;
      title: string;
      markdown: {
        rawMarkdownBody: string;
      };
    };
  };
}

export default function About({ location, data }: Props): JSX.Element {
  return (
    <Layout>
      {parse(
        marked(data.page.markdown.rawMarkdownBody, {
          pedantic: true,
        }).toString()
      )}
    </Layout>
  );
}

export const query = graphql`
  query PageForSlug {
    page(slug: { eq: "about" }) {
      slug
      date
      title
      markdown {
        rawMarkdownBody
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 75) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;