import { graphql } from "gatsby";
import pluralize from "pluralize";
import React from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";
import ListItemWithSlug from "../components/ListItemWithSlug";
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
import TwoColumns, { Column1, Column2 } from "../components/TwoColumns";

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
  state: WatchlistTitleItem[];
  setState(state: WatchlistTitleItem[]): void;
  heading: string;
}

const matchers: { [key: string]: (title: WatchlistTitle) => boolean } = {};

function FilterPanel({
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
    <Panel heading={heading}>
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

const List = styled.ol`
  margin: 0 0 35px;
  padding: 0;
`;

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

  return `it's a ${formattedNames} film`;
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
    <ListItemWithSlug
      visible={watchlistTitle.match}
      title={`${watchlistTitle.movie.title} (${watchlistTitle.movie.year})`}
      slug={buildSlug(watchlistTitle)}
    />
  );
});

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
      <PageHeader
        header="The Watchlist"
        slug={`My movie review bucketlist. ${Number(
          data.allWatchlistTitle.nodes.length
        ).toLocaleString()} ${pluralize(
          "title",
          data.allWatchlistTitle.nodes.length
        )}. No silents or documentaries.`}
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
          <List>
            {state.map((title) => (
              <WatchlistTitleItem key={title.imdbId} watchlistTitle={title} />
            ))}
          </List>
        </Column2>
      </TwoColumns>
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
