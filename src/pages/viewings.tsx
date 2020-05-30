/** @jsx jsx  */
import { graphql } from "gatsby";
import moment from "moment";
import React from "react";

import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import Layout, { breakpoints } from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import RangeFilter from "../components/RangeFilter";
import SelectFilter from "../components/SelectFilter";
import Sorter, {
  collator,
  sortStringAsc,
  sortStringDesc,
} from "../components/Sorter";
import TextFilter from "../components/TextFilter";
import { TitleList, TitleListItem } from "../components/TitleList";

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
    onChange("viewingYear", (viewing: Viewing): boolean => {
      if (value === "All") {
        return true;
      }

      return viewing.date.startsWith(value);
    });
  };

  return (
    <SelectFilter onChange={handleChange} label={label}>
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
    onChange("venue", (viewing: Viewing): boolean => {
      if (value === "All") {
        return true;
      }

      return viewing.venue === value;
    });
  };

  return (
    <SelectFilter onChange={handleChange} label={label}>
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

interface ViewingSorterProps {
  label: string;
  viewings: Viewing[];
  onChange(sortedViewings: Viewing[]): void;
}

function ViewingSorter({
  label,
  viewings,
  onChange,
}: ViewingSorterProps): JSX.Element {
  const sortViewingDateAsc = (a: Viewing, b: Viewing): number => {
    return sortStringAsc(a.date, b.date);
  };

  const sortViewingDateDesc = (a: Viewing, b: Viewing): number => {
    return sortStringDesc(a.date, b.date);
  };

  const sortReleaseDateAsc = (a: Viewing, b: Viewing): number => {
    return sortStringAsc(a.movie.year, b.movie.year);
  };

  const sortReleaseDateDesc = (a: Viewing, b: Viewing): number => {
    return sortStringDesc(a.movie.year, b.movie.year);
  };

  const sortTitleAsc = (a: Viewing, b: Viewing): number => {
    return collator.compare(a.movie.sortTitle, b.movie.sortTitle);
  };

  const handleChange = (sortedViewings: Viewing[]): void => {
    onChange(sortedViewings);
  };

  return (
    <Sorter<Viewing>
      label={label}
      collection={viewings}
      onChange={handleChange}
    >
      {{
        "Viewing Date (Newest First)": sortViewingDateDesc,
        "Viewing Date (Oldest First)": sortViewingDateAsc,
        "Release Date (Newest First)": sortReleaseDateDesc,
        "Release Date (Oldest First)": sortReleaseDateAsc,
        Title: sortTitleAsc,
      }}
    </Sorter>
  );
}

interface ViewingListItem extends Viewing {
  match: boolean;
}

interface FilterPanelProps {
  className?: string;
  state: {
    viewings: ViewingListItem[];
    ids: number[];
  };
  setState(state: { viewings: ViewingListItem[]; ids: number[] }): void;
  heading: string;
}

const matchers: { [key: string]: (viewing: Viewing) => boolean } = {};

function FilterPanel({
  className,
  state,
  setState,
  heading,
}: FilterPanelProps): JSX.Element {
  const onFilterChange = (
    filterId: string,
    matcher: (viewing: Viewing) => boolean
  ): void => {
    matchers[filterId] = matcher;

    const viewings = state.viewings.map((viewing) => {
      const match = !Object.values(matchers).some((filterMatcher) => {
        return !filterMatcher(viewing);
      });

      if (match === viewing.match) {
        return viewing;
      }

      return { ...viewing, match };
    });
    setState({ ...state, viewings });
  };

  const onSortChange = (sortedViewings: ViewingListItem[]): void => {
    setState({ ...state, viewings: sortedViewings });
  };

  return (
    <Panel heading={heading} className={className}>
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
      <ViewingSorter
        label="Order By"
        viewings={state.viewings}
        onChange={onSortChange}
      />
    </Panel>
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

interface ViewingListItemProps {
  viewing: ViewingListItem;
}

const ViewingListItem = React.memo(function ViewingListItem({
  viewing,
}: ViewingListItemProps): JSX.Element {
  return (
    <TitleListItem
      visible={viewing.match}
      title={viewing.movie.title}
      year={viewing.movie.year}
      slug={buildSlug(viewing)}
    />
  );
});

const ViewingsWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 168rem;

  @media screen and (min-width: 700px) {
    width: calc(100% - 8rem);
  }

  @media screen and (min-width: 1220px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

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
      <ViewingsWrap>
        <PageHeader
          css={css`
            width: 100%;
          `}
          heading="Viewing Log"
          slug={`I've watched ${data.allViewing.nodes.length} movies since 2012.`}
        />
        <FilterPanel
          css={css`
            @media screen and (min-width: 1220px) {
              width: 33%;
            }
          `}
          state={state}
          setState={setState}
          heading="Filter and Sort"
        />
        <TitleList
          css={css`
            @media screen and (min-width: 1220px) {
              width: 66%;
            }
          `}
        >
          {state.viewings.map((viewing) => (
            <ViewingListItem
              key={`${viewing.sequence}-${viewing.imdbId}`}
              viewing={viewing}
            />
          ))}
        </TitleList>
      </ViewingsWrap>
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
