/** @jsx jsx  */
import { graphql } from "gatsby";
import pluralize from "pluralize";
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
import TitleFilter from "../components/TitleFilter";
import { TitleList, TitleListItem } from "../components/TitleList";

interface WatchlistPerson {
  fullName: string;
}

interface WatchlistCollection {
  name: string;
}

interface WatchlistTitle {
  imdbId: string;
  movie: {
    title: string;
    sortTitle: string;
    year: string;
  };
  directors: WatchlistPerson[];
  performers: WatchlistPerson[];
  writers: WatchlistPerson[];
  collections: WatchlistCollection[];
}

interface WatchlistSelectFilterProps {
  label: string;
  titles: WatchlistTitle[];
  onChange(filterId: string, matcher: (title: WatchlistTitle) => boolean): void;
}

function DirectorFilter({
  label,
  titles,
  onChange,
}: WatchlistSelectFilterProps): JSX.Element {
  const personOptions = [
    ...new Set(
      titles
        .map((title) => {
          return title.directors.map((person) => person.fullName);
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ]
    .sort()
    .map((person): [string, string] => {
      return [person, person];
    });

  const handleChange = (value: string): void => {
    onChange("director", (title: WatchlistTitle): boolean => {
      if (value === "All") {
        return true;
      }

      return title.directors.some((person) => {
        return person.fullName === value;
      });
    });
  };

  return (
    <SelectFilter onChange={handleChange} label={label}>
      {personOptions}
    </SelectFilter>
  );
}

function PerformerFilter({
  label,
  titles,
  onChange,
}: WatchlistSelectFilterProps): JSX.Element {
  const personOptions = [
    ...new Set(
      titles
        .map((title) => {
          return title.performers.map((person) => person.fullName);
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ]
    .sort()
    .map((person): [string, string] => {
      return [person, person];
    });

  const handleChange = (value: string): void => {
    onChange("performer", (title: WatchlistTitle): boolean => {
      if (value === "All") {
        return true;
      }

      return title.performers.some((person) => {
        return person.fullName === value;
      });
    });
  };

  return (
    <SelectFilter onChange={handleChange} label={label}>
      {personOptions}
    </SelectFilter>
  );
}

function WriterFilter({
  label,
  titles,
  onChange,
}: WatchlistSelectFilterProps): JSX.Element {
  const personOptions = [
    ...new Set(
      titles
        .map((title) => {
          return title.writers.map((person) => person.fullName);
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ]
    .sort()
    .map((person): [string, string] => {
      return [person, person];
    });

  const handleChange = (value: string): void => {
    onChange("writer", (title: WatchlistTitle): boolean => {
      if (value === "All") {
        return true;
      }

      return title.writers.some((person) => {
        return person.fullName === value;
      });
    });
  };

  return (
    <SelectFilter onChange={handleChange} label={label}>
      {personOptions}
    </SelectFilter>
  );
}

interface TitleSorterProps {
  label: string;
  titles: WatchlistTitle[];
  onChange(sortedTitles: WatchlistTitle[]): void;
}

function TitleSorter({
  label,
  titles,
  onChange,
}: TitleSorterProps): JSX.Element {
  const sortReleaseDateAsc = (a: WatchlistTitle, b: WatchlistTitle): number => {
    return sortStringAsc(a.movie.year, b.movie.year);
  };

  const sortReleaseDateDesc = (
    a: WatchlistTitle,
    b: WatchlistTitle
  ): number => {
    return sortStringDesc(a.movie.year, b.movie.year);
  };

  const sortTitleAsc = (a: WatchlistTitle, b: WatchlistTitle): number => {
    return collator.compare(a.movie.sortTitle, b.movie.sortTitle);
  };

  const handleChange = (sortedViewings: WatchlistTitle[]): void => {
    onChange([...sortedViewings]);
  };

  return (
    <Sorter<WatchlistTitle>
      label={label}
      collection={titles}
      onChange={handleChange}
    >
      {{
        "Release Date (Oldest First)": sortReleaseDateAsc,
        "Release Date (Newest First)": sortReleaseDateDesc,
        Title: sortTitleAsc,
      }}
    </Sorter>
  );
}

interface WatchlistTitleItem extends WatchlistTitle {
  match: boolean;
}

interface FilterPanelProps {
  className?: string;
  state: WatchlistTitleItem[];
  setState(state: WatchlistTitleItem[]): void;
  heading: string;
}

const matchers: { [key: string]: (title: WatchlistTitle) => boolean } = {};

function FilterPanel({
  className,
  state,
  setState,
  heading,
}: FilterPanelProps): JSX.Element {
  const onFilterChange = (
    filterId: string,
    matcher: (title: WatchlistTitle) => boolean
  ): void => {
    matchers[filterId] = matcher;

    const titles = state.map((title) => {
      const match = !Object.values(matchers).some((filterMatcher) => {
        return !filterMatcher(title);
      });

      if (match === title.match) {
        return title;
      }

      return { ...title, match };
    });
    setState(titles);
  };

  const onSortChange = (sortedTitles: WatchlistTitleItem[]): void => {
    setState(sortedTitles);
  };

  return (
    <Panel className={className} heading={heading}>
      <TitleFilter
        onChange={onFilterChange}
        label="Title"
        placeholder="Enter all or part of a title."
      />
      <DirectorFilter
        label="Director"
        titles={state}
        onChange={onFilterChange}
      />
      <PerformerFilter
        label="Performer"
        titles={state}
        onChange={onFilterChange}
      />
      <WriterFilter label="Writer" titles={state} onChange={onFilterChange} />
      <ReleaseYearFilter
        label="Release Year"
        titles={state}
        onChange={onFilterChange}
      />
      <TitleSorter label="Order By" titles={state} onChange={onSortChange} />
    </Panel>
  );
}

function ReleaseYearFilter({
  label,
  titles,
  onChange,
}: WatchlistSelectFilterProps): JSX.Element {
  const releaseYears = titles
    .map((title) => {
      return title.movie.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  const handleChange = (values: number[]): void => {
    onChange("releaseYear", (title: WatchlistTitle): boolean => {
      if (values === [minYear, maxYear]) {
        return true;
      }

      const value = parseInt(title.movie.year, 10);
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

const formatCollections = (collections: Array<WatchlistCollection>): string => {
  if (collections.length === 0) {
    return "";
  }

  const names = collections.map((collection) => collection.name);

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `it's in the "${formattedNames}" collection`;
};

const buildSlug = (watchlistTitle: WatchlistTitle): string => {
  const credits = [
    formatPeople(watchlistTitle.directors, "directed"),
    formatPeople(watchlistTitle.performers, "performed"),
    formatPeople(watchlistTitle.writers, "has a writing credit"),
    formatCollections(watchlistTitle.collections),
  ];

  let slug = "";

  while (credits.length > 0) {
    const credit = credits.shift();

    slug += credit;

    if (slug && credits.find((item) => item.length > 0)) {
      slug += " and ";
    }
  }

  return `Because ${slug}.`;
};

interface WatchlistTitleItemProps {
  watchlistTitle: WatchlistTitleItem;
}

const WatchlistTitleItem = React.memo(function WatchlistTitleItem({
  watchlistTitle,
}: WatchlistTitleItemProps): JSX.Element {
  return (
    <TitleListItem
      visible={watchlistTitle.match}
      title={watchlistTitle.movie.title}
      year={watchlistTitle.movie.year}
      slug={buildSlug(watchlistTitle)}
    />
  );
});

const ToWatchWrap = styled.div`
  @media only screen and (min-width: ${breakpoints.mid}) {
    display: grid;
    grid-template-columns: 38.2% 61.8%;
    grid-template-rows: auto auto 1fr;
    height: 100%;
    padding: 0 0 0 30px;
  }
`;

interface Props {
  data: {
    allWatchlistTitle: {
      nodes: WatchlistTitle[];
    };
  };
}

export default function Watchlist({ data }: Props): JSX.Element {
  const titles = data.allWatchlistTitle.nodes.map((node) => {
    return { ...node, match: true };
  });

  const [state, setState] = React.useState(titles);

  return (
    <Layout>
      <ToWatchWrap>
        <PageHeader
          css={css`
            @media only screen and (min-width: ${breakpoints.mid}) {
              grid-column: 1 / -1;
              grid-row: 1 / 2;
            }
          `}
          heading="To-Watch List"
          slug={`My movie review bucketlist. ${Number(
            data.allWatchlistTitle.nodes.length
          ).toLocaleString()} ${pluralize(
            "title",
            data.allWatchlistTitle.nodes.length
          )}. No silents or documentaries.`}
        />
        <FilterPanel
          css={css`
            @media only screen and (min-width: ${breakpoints.mid}) {
              grid-column: 1 / 2;
              grid-row: 2 /3;
              margin-top: 52px;
            }
          `}
          state={state}
          setState={setState}
          heading="Filter and Sort"
        />
        <TitleList
          css={css`
            @media only screen and (min-width: ${breakpoints.mid}) {
              grid-column: 2 / 3;
              grid-row: 2 / 4;
              padding-top: 9px;
            }
          `}
        >
          {state.map((title) => (
            <WatchlistTitleItem key={title.imdbId} watchlistTitle={title} />
          ))}
        </TitleList>
      </ToWatchWrap>
    </Layout>
  );
}

export const query = graphql`
  query {
    allWatchlistTitle(sort: { fields: [movie___year], order: ASC }) {
      nodes {
        imdbId
        movie {
          title
          sortTitle
          year
        }
        directors {
          fullName
        }
        performers {
          fullName
        }
        writers {
          fullName
        }
        collections {
          name
        }
      }
    }
  }
`;
