import { graphql } from "gatsby";
import moment from "moment";
import React from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";
import RangeFilter from "../components/RangeFilter";
import TextFilter from "../components/TextFilter";

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

interface ViewingSelectFilterProps {
  label: string;
  viewings: Viewing[];
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function ViewingYearSelectFilter({
  label,
  viewings,
  onChange,
}: ViewingSelectFilterProps): JSX.Element {
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

function VenueFilter({
  label,
  viewings,
  onChange,
}: ViewingSelectFilterProps): JSX.Element {
  const venues = [
    ...new Set(
      viewings.map((viewing) => {
        return viewing.venue;
      })
    ),
  ].sort();

  const venueOptions = venues.map((venue): [string, string] => {
    return [venue, venue];
  });

  const handleChange = (value: string): void => {
    console.log("change");
    console.log(value);
    onChange("venu", (viewing: Viewing): boolean => {
      if (value === "All") {
        return true;
      }

      return viewing.venue === value;
    });
  };

  return (
    <SelectFilter
      onChange={(e): void => handleChange(e.target.value)}
      label={label}
    >
      {venueOptions}
    </SelectFilter>
  );
}

function escapeRegExp(str = ""): string {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

interface TitleFilterProps {
  label: string;
  placeholder: string;
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function TitleFilter({
  label,
  placeholder,
  onChange,
}: TitleFilterProps): JSX.Element {
  const handleChange = (value: string): void => {
    const regex = new RegExp(escapeRegExp(value), "i");
    onChange("title", (viewing: Viewing): boolean => {
      return regex.test(viewing.movie.title);
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

  return (
    <Container data-filter-controls data-target="#viewings">
      <Heading>{heading}</Heading>
      <Content>
        <TitleFilter
          onChange={onFilterChange}
          label="Title"
          placeholder="Enter all or part of a title."
        />
        <ReleaseYearFilter
          label="Release Year"
          viewings={state.viewings}
          onChange={onFilterChange}
        />
        <ViewingYearSelectFilter
          label="Viewing Year"
          viewings={state.viewings}
          onChange={onFilterChange}
        />
        <VenueFilter
          label="Venue"
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

interface ReleaseYearFilterProps {
  label: string;
  viewings: Viewing[];
  onChange(filterId: string, matcher: (viewing: Viewing) => boolean): void;
}

function ReleaseYearFilter({
  label,
  viewings,
  onChange,
}: ReleaseYearFilterProps): JSX.Element {
  const releaseYears = viewings
    .map((viewing) => {
      return viewing.movie.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  const handleChange = (values: number[]): void => {
    onChange("releaseYear", (viewing: Viewing): boolean => {
      if (values === [minYear, maxYear]) {
        return true;
      }

      const value = parseInt(viewing.movie.year, 10);
      return value >= values[0] && value <= values[1];
    });
  };

  return (
    <RangeFilter
      label={label}
      min={minYear}
      max={maxYear}
      handleChange={handleChange}
    />
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
