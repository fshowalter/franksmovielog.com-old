import { graphql } from "gatsby";
import moment from "moment";
import React from "react";
import ReactSlider from "react-slider";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Layout from "../components/Layout";

interface Viewing {
  sequence: number;
  date: string;
  imdbId: string;
  venue: string;
  movie: {
    sortTitle: string;
    title: string;
    year: string;
  };
}

interface Props {
  data: {
    allViewing: {
      nodes: Viewing[];
    };
  };
}

function buildSlug(node: Props["data"]["allViewing"]["nodes"][0]): string {
  return `${moment(node.date).format("dddd MMM D, YYYY")} via ${node.venue}.`;
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
  border: 1px solid #eee;
  border-left: none;
  border-right: none;
  transition: opacity 0.3s ease;

  @media only screen and (min-width: 48em) {
    border: none;
    border-right: solid 1px #eee;
  }
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

  @media only screen and (min-width: 48em) {
    padding: 20px 0;
  }
`;

const Content = styled.div`
  padding: 0 20px;

  @media only screen and (min-width: 48em) {
    padding: 0 50px 20px 0;
  }
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
  border-bottom: solid 1px #eee;
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
  children: Array<[string, string]>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SelectFilter({
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
      <SelectInput onChange={onChange}>{options}</SelectInput>
    </FilterControl>
  );
}

interface ViewingYearSelectFilter {
  label: string;
  viewings: Viewing[];
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function ViewingYearSelectFilter({
  label,
  viewings,
  onChange,
}: ViewingYearSelectFilter): JSX.Element {
  const yearOptions = [
    ...new Set(
      viewings.map((viewing) => {
        return viewing.date.substring(0, 4);
      })
    ),
  ]
    .sort()
    .map((year): [string, string] => {
      return [year, year];
    });

  const handleChange = (value: string): void => {
    console.log("change");
    console.log(value);
    onChange("viewingYear", (viewing: Viewing): boolean => {
      if (value === "All") {
        return true;
      }

      return viewing.date.startsWith(value);
    });
  };

  return (
    <SelectFilter
      onChange={(e): void => handleChange(e.target.value)}
      label={label}
    >
      {yearOptions}
    </SelectFilter>
  );
}

interface TextFilterProps {
  label: string;
  placeholder: string;
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function escapeRegExp(str = ""): string {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

const delay = (func: Function, wait: number, ...args: any[]) => {
  console.log(`delaying for ${wait}`);
  return setTimeout(function () {
    return func(...args);
  }, wait);
};

function underscoreDebounce(
  func: Function,
  wait: number
): (...args: any[]) => void {
  let result: unknown;
  let timeout: NodeJS.Timeout | null = null;

  const later = function (context: Function, args: any) {
    timeout = null;
    if (args) {
      result = func.apply(context, args);
    }
  };

  return function debouncedFunction(...args): unknown {
    if (timeout) {
      console.log("clearing");
      clearTimeout(timeout);
    }

    timeout = delay(later, wait, this, args);
    return result;
  };
}

function TextFilter({
  label,
  placeholder,
  onChange,
}: TextFilterProps): JSX.Element {
  const handleChange = (value: string): void => {
    const regex = new RegExp(escapeRegExp(value), "i");
    console.log("change");
    console.log(Date.now());
    onChange("title", (viewing: Viewing): boolean => {
      return regex.test(viewing.movie.title);
    });
  };

  const debouncedHandleChange = underscoreDebounce(handleChange, 150);

  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <TextInputWrap>
        <TextInput
          name={label}
          placeholder={placeholder}
          onChange={(e): void => debouncedHandleChange(e.target.value)}
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

function slugForVenue(venue: string): string {
  return venue
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "");
}

interface ViewingListItem extends Viewing {
  match: boolean;
}

interface FilterPanelProps {
  state: {
    viewings: ViewingListItem[];
    ids: number[];
  };
  setState(state: { ids: number[]; viewings: ViewingListItem[] }): void;
  heading: string;
}

const matchers: { [key: string]: (viewing: Viewing) => boolean } = {};

function FilterPanel({
  state,
  setState,
  heading,
}: FilterPanelProps): JSX.Element {
  function filterViewings(): void {
    console.log("debounceasync");
    console.log(Date.now());

    const viewings = state.viewings.map((viewing) => {
      const match = !Object.values(matchers).some((filterMatcher) => {
        return !filterMatcher(viewing);
      });

      return { ...viewing, match };
    });

    setState({ ...state, viewings });
  }

  const onFilterChange = (
    filterId: string,
    matcher: (viewing: Viewing) => boolean
  ): void => {
    matchers[filterId] = matcher;
    console.log("filterChange");
    console.log(Date.now());
    filterViewings();
  };

  const venues = [
    ...new Set(
      state.viewings.map((viewing) => {
        return viewing.venue;
      })
    ),
  ].sort();

  const venueOptions = venues.map((venue): [string, string] => {
    return [venue, slugForVenue(venue)];
  });

  return (
    <Container data-filter-controls data-target="#viewings">
      <Heading>{heading}</Heading>
      <Content>
        <TextFilter
          onChange={onFilterChange}
          label="Title"
          placeholder="Enter all or part of a title."
        />
        <RangeFilter
          name="Release Year"
          viewings={state.viewings}
          onChange={onFilterChange}
        />
        <ViewingYearSelectFilter
          label="Viewing Year"
          viewings={state.viewings}
          onChange={onFilterChange}
        />

        <Sorter name="Order By" target="#viewings">
          {[
            ["Viewing Date (Newest First)", "viewing-date-desc"],
            ["Viewing Date (Oldest First)", "viewing-date-asc"],
            ["Release Date (Newest First)", "release-date-desc"],
            ["Release Date (Oldest First)", "release-date-asc"],
            ["Title", "sort-title-asc"],
          ]}
        </Sorter>
      </Content>
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

const StyledSlider = styled(ReactSlider)`
  flex: 1 100%;
`;

const StyledThumb = styled.div`
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.54);
  border-radius: 50%;
  cursor: grab;
  height: 2rem;
  left: -1rem;
  position: relative;
  top: -0.5rem;
  width: 2rem;
  z-index: 1;
`;

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
);

const StyledTrack = styled.div`
  background: rgba(0, 0, 0, 0.02);
  border-bottom: solid 0.5rem #fff;
  border-top: solid 0.5rem #fff;
  height: 2rem;
  margin: auto 0.8rem;
  position: relative;

  @media only screen and (min-width: 35em) {
    border-color: #fff;
  }
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

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
  viewings: Viewing[];
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function RangeFilter({
  name,
  viewings,
  onChange,
}: RangeFilterProps): JSX.Element {
  const releaseYears = viewings
    .map((viewing) => {
      return viewing.movie.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  const initialState = [minYear, maxYear];

  const [state, setState] = React.useState(initialState.slice());

  console.log(minYear);
  console.log(maxYear);

  const handleSliderChange = (
    values: number | number[] | null | undefined
  ): void => {
    if (!Array.isArray(values)) {
      return;
    }
    console.log("change");
    console.log(Date.now());
    setState(values);
    onChange("releaseYear", (viewing: Viewing): boolean => {
      if (state === initialState) {
        return true;
      }

      const value = parseInt(viewing.movie.year, 10);
      return value >= state[0] && value <= state[1];
    });
  };

  const handleMinChange = (value: string): void => {
    setState([parseInt(value, 10), state[1]]);
  };

  const handleMaxChange = (value: string): void => {
    setState([state[0], parseInt(value, 10)]);
  };

  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <RangeFilterWrap>
        <StyledSlider
          value={state}
          max={maxYear}
          min={minYear}
          renderTrack={Track}
          renderThumb={Thumb}
          onAfterChange={handleSliderChange}
        />
        <RangeInputMin
          type="number"
          value={state[0]}
          min={minYear}
          max={maxYear}
          step="1"
          onChange={(e) => handleMinChange(e.target.value)}
          className="filter-numeric min"
        />
        <RangeInputMax
          type="number"
          value={state[1]}
          min={minYear}
          max={maxYear}
          onChange={(e) => handleMaxChange(e.target.value)}
          step="1"
          className="filter-numeric max"
        />
      </RangeFilterWrap>
    </FilterControl>
  );
}

const PanelHeaderHeader = styled.header`
  padding: 20px;

  @media only screen and (min-width: 48em) {
    padding: 10px 0 20px;
    text-align: left;
  }

  @media only screen and (min-width: 71.24em) {
    padding-top: 0;
  }
`;

const PanelHeaderHeading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const PanelHeaderSlug = styled.div`
  color: rgba(0, 0, 0, 0.54);
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
`;

const ListItem = styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: #eee;
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 20px;
    margin: 0;
    position: absolute;
    right: 0;
  }
`;

interface ViewingListItemProps {
  viewing: ViewingListItem;
}

const ViewingListItem = React.memo(function ViewingListItem({
  viewing,
}: ViewingListItemProps): JSX.Element {
  const style = viewing.match ? undefined : { display: "none" };

  return (
    <ListItem style={style}>
      <Title>
        {viewing.movie.title} ({viewing.movie.year})
      </Title>
      <Slug>{buildSlug(viewing)}</Slug>
    </ListItem>
  );
});

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
  color: rgba(0, 0, 0, 0.38);
  font-size: 15px;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;
`;

const ColumnWrap = styled.div`
  @media only screen and (min-width: 48em) {
    border-top: solid 1px #eee;
    display: flex;
    margin: 0 auto;
    width: 700px;
  }
  @media only screen and (min-width: 71.24em) {
    width: 900px;
  }
`;

const Column1 = styled.div`
  @media only screen and (min-width: 48em) {
    width: 250px;
  }

  @media only screen and (min-width: 71.24em) {
    width: 340px;
  }
`;

const Column2 = styled.div`
  @media only screen and (min-width: 48em) {
    padding-left: 30px;
    width: 420px;
  }

  @media only screen and (min-width: 71.24em) {
    width: 540px;
  }
`;

interface TwoColumnsProps {
  children: React.ReactNode;
}

function TwoColumns({ children }: TwoColumnsProps): JSX.Element {
  return <ColumnWrap>{children}</ColumnWrap>;
}

export default function Viewings({ data }: Props): JSX.Element {
  const viewings = data.allViewing.nodes.map((node) => {
    return { ...node, match: true };
  });

  const ids = data.allViewing.nodes.map((node) => {
    return node.sequence;
  });

  const [state, setState] = React.useState({ viewings, ids });

  return (
    <Layout>
      <PanelHeader
        title="Viewing Log"
        slug={`I've watched ${data.allViewing.nodes.length} movies since 2012`}
      />
      <TwoColumns>
        <Column1>
          <FilterPanel
            state={state}
            setState={setState}
            heading="Filter and Sort"
          />
        </Column1>
        <Column2>
          <List id="viewings">
            {state.viewings.map((viewing) => (
              <ViewingListItem
                key={`${viewing.sequence}-${viewing.imdbId}`}
                viewing={viewing}
              />
            ))}
          </List>
        </Column2>
      </TwoColumns>
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
