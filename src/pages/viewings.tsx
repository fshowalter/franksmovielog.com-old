import { graphql } from "gatsby";
import moment from "moment";
import React, { ReactNode } from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Layout from "../components/Layout";

function buildSlug(node: Props["data"]["allViewing"]["nodes"][0]): string {
  return `${moment(node.date).format("dddd, MMMM Do YYYY")} via ${node.venue}.`;
}

const FilterControl = styled.div`
  margin-bottom: 35px;
`;

const Label = styled.label`
  color: #222;
  display: block;
  font-size: 15px;
  font-weight: normal;
  letter-spacing: 0.5px;
  line-height: 2.2;
`;

const Container = styled.div`
  /* background: #fefefe; */
  border: 1px solid #eee;
  border-left: none;
  border-right: none;
  /* border-radius: 5px; */
  /* margin: 20px; */
  transition: opacity 0.3s ease;
`;

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-primary);
  display: block;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 20px;
  padding: 20px;
  position: relative;
  text-decoration: none;
  /* letter-spacing: 0.5px; */
`;

const Content = styled.div`
  padding: 0 20px;
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: #fff;
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
    color: rgba(0, 0, 0, 0.54);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
  }
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px $filter_border_color;
  margin-bottom: 8px;
  padding-bottom: 7px;
`;

const SelectInput = styled.select`
  appearance: none;
  backface-visibility: hidden;
  background-color: #fff;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.54);
  display: block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  padding: 0;
  text-indent: 0.01px;
  text-overflow: "";
  width: 100%;
`;

interface SelectFilterProps {
  label: string;
  filterAttribute: string;
  children: Array<[string, string]>;
}

function SelectFilter({
  label,
  filterAttribute,
  children,
}: SelectFilterProps): JSX.Element {
  const options = [
    <option>All</option>,
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
        data-filter-type="select"
        data-filter-attribute={filterAttribute}
      >
        {options}
      </SelectInput>
    </FilterControl>
  );
}

interface TextFilterProps {
  label: string;
  placeholder: string;
  filterAttribute: string;
}

function TextFilter({
  label,
  placeholder,
  filterAttribute,
}: TextFilterProps): JSX.Element {
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
}

interface SorterProps {
  name: string;
  children: Array<[string, string]>;
  target: string;
}

function Sorter({ name, children, target }: SorterProps): JSX.Element {
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
              {optionName}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
}

interface FilterPanelProps {
  heading: string;
  children: ReactNode;
}

function FilterPanel({ heading, children }: FilterPanelProps): JSX.Element {
  return (
    <Container data-filter-controls data-target="#viewings">
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </Container>
  );
}

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
    box-shadow: inset 0 0 5px #222;
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
    border: 1px solid rgba(0, 0, 0, 0.54);
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
  color: rgba(0, 0, 0, 0.54);
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
  name: string;
  attribute: string;
  min: string;
  max: string;
}

function RangeFilter({
  name,
  attribute,
  min,
  max,
}: RangeFilterProps): JSX.Element {
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
}

const PanelHeaderHeader = styled.header`
  padding: 20px;

  @media only screen and (min-width: 50em) {
    margin: 20px;
    padding: 20px;
    text-align: left;
  }
`;

const PanelHeaderHeading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const PanelHeaderSlug = styled.div`
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 0;
`;

interface PanelHeaderProps {
  title: string;
  slug: string;
}

function PanelHeader({ title, slug }: PanelHeaderProps): JSX.Element {
  return (
    <PanelHeaderHeader>
      <PanelHeaderHeading>{title}</PanelHeaderHeading>
      <PanelHeaderSlug>{slug}</PanelHeaderSlug>
    </PanelHeaderHeader>
  );
}

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

interface Props {
  data: {
    allViewing: {
      nodes: {
        sequence: number;
        date: string;
        imdbId: string;
        venue: string;
        movie: {
          sortTitle: string;
          title: string;
          year: string;
        };
      }[];
    };
  };
}

function slugForVenue(venue: string): string {
  return venue
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "");
}

export default function Viewings({ data }: Props): JSX.Element {
  const releaseYears = data.allViewing.nodes
    .map((node) => {
      return node.movie.year;
    })
    .sort();

  const minYear = releaseYears[0];
  const maxYear = releaseYears[releaseYears.length - 1];

  const venues = [
    ...new Set(
      data.allViewing.nodes.map((node) => {
        return node.venue;
      })
    ),
  ].sort();

  const venueOptions = venues.map((venue): [string, string] => {
    return [venue, slugForVenue(venue)];
  });

  const yearOptions = [
    ...new Set(
      data.allViewing.nodes.map((node) => {
        return node.date.substring(0, 4);
      })
    ),
  ]
    .sort()
    .map((year): [string, string] => {
      return [year, year];
    });

  return (
    <Layout>
      <PanelHeader
        title="Viewing Log"
        slug={`I've watched ${data.allViewing.nodes.length} movies since 2012`}
      />
      <FilterPanel heading="Filter and Sort">
        <TextFilter
          label="Title"
          placeholder="Enter all or part of a title."
          filterAttribute="data-title"
        />
        <RangeFilter
          name="Release Year"
          attribute="data-release-date"
          min={minYear}
          max={maxYear}
        />
        <SelectFilter label="Viewing Year" filterAttribute="data-viewing-year">
          {yearOptions}
        </SelectFilter>
        <SelectFilter label="Via" filterAttribute="data-via">
          {venueOptions}
        </SelectFilter>

        <Sorter name="Order By" target="#viewings">
          {[
            ["Viewing Date (Newest First)", "viewing-date-desc"],
            ["Viewing Date (Oldest First)", "viewing-date-asc"],
            ["Release Date (Newest First)", "release-date-desc"],
            ["Release Date (Oldest First)", "release-date-asc"],
            ["Title", "sort-title-asc"],
          ]}
        </Sorter>
      </FilterPanel>
      <List id="viewings">
        {data.allViewing.nodes.map((viewing) => (
          <ListItem
            key={viewing.imdbId}
            data-title={viewing.movie.title}
            data-sort-title={viewing.movie.sortTitle}
            data-viewing-date={viewing.date}
            data-release-date={viewing.movie.year}
            data-via={slugForVenue(viewing.venue)}
            data-viewing-year={viewing.date.substring(0, 4)}
          >
            <Title>
              {viewing.movie.title} ({viewing.movie.year})
            </Title>
            <Slug>{buildSlug(viewing)}</Slug>
          </ListItem>
        ))}
      </List>
    </Layout>
  );
}

export const query = graphql`
  query {
    allViewing(sort: { fields: [sequence], order: DESC }) {
      nodes {
        sequence
        date(formatString: "YYYY-MM-DD")
        imdbId
        venue
        movie {
          sortTitle
          title
          year
        }
      }
    }
  }
`;
