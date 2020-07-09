import "./to-watch.scss";

import { graphql } from "gatsby";
import React, { useReducer } from "react";
import PropTypes from "prop-types";

import { collator, sortStringAsc, sortStringDesc } from "../utils/sort-utils";
import DebouncedInput from "../components/DebouncedInput/DebouncedInput";
import Layout from "../components/Layout";
import Pagination, { PaginationHeader } from "../components/Pagination";
import RangeInput from "../components/RangeInput";
import ReviewLink from "../components/ReviewLink";

function WatchlistOptions({ titles, keyName }) {
  const names = [
    ...new Set(
      titles
        .map((title) => {
          return title[keyName] ? title[keyName].split("|") : [];
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ].sort((a, b) => collator.compare(a, b));

  return (
    <>
      <option key="all" value="All">
        All
      </option>
      {names.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </>
  );
}

WatchlistOptions.propTypes = {
  keyName: PropTypes.oneOf([
    "directorNamesConcat",
    "performerNamesConcat",
    "writerNamesConcat",
    "collectionNamesConcat",
  ]).isRequired,
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      directorNamesConcat: PropTypes.string,
      performerNamesConcat: PropTypes.string,
      writerNamesConcat: PropTypes.string,
      collectionNamesConcat: PropTypes.string,
    })
  ).isRequired,
};

function WatchlistTitle({ title }) {
  return (
    <div className="to_watch-title">
      <ReviewLink imdbId={title.imdb_id} className="to_watch-title_link">
        <>
          {title.title}{" "}
          <span className="to_watch-title_year">{title.year}</span>
        </>
      </ReviewLink>
    </div>
  );
}

WatchlistTitle.propTypes = {
  title: PropTypes.shape({
    imdb_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

function joinSentence(array) {
  const items = array.filter((item) => !!item);

  let lastWord;

  if (items.length > 1) {
    lastWord = ` and ${items.pop()}`;
    if (items.length > 1) {
      lastWord = `,${lastWord}`;
    }
  } else {
    lastWord = "";
  }
  return items.join(", ") + lastWord;
}

function formatPeople(people, suffix) {
  if (!people) {
    return "";
  }

  const names = people.split("|");

  const formattedNames = joinSentence(names);

  return `${formattedNames} ${suffix}`;
}

function formatCollections(collections) {
  if (!collections) {
    return "";
  }
  const names = collections.split("|");

  const suffix = names.length > 1 ? "collections" : "collection";

  const formattedNames = joinSentence(names);

  return `it's in the "${formattedNames}" ${suffix}`;
}

function WatchlistSlug({ title }) {
  const credits = [
    formatPeople(title.directorNamesConcat, "directed"),
    formatPeople(title.performerNamesConcat, "performed"),
    formatPeople(title.writerNamesConcat, "has a writing credit"),
    formatCollections(title.collectionNamesConcat),
  ];

  return (
    <div className="viewings-viewing_slug">
      Because {joinSentence(credits)}.
    </div>
  );
}

WatchlistSlug.propTypes = {
  title: PropTypes.shape({
    directorNamesConcat: PropTypes.string,
    performerNamesConcat: PropTypes.string,
    writerNamesConcat: PropTypes.string,
    collectionNamesConcat: PropTypes.string,
  }).isRequired,
};

function sortReleaseDateAsc(a, b) {
  return sortStringAsc(a.year, b.year);
}

function sortReleaseDateDesc(a, b) {
  return sortStringDesc(a.year, b.year);
}

function sortTitleAsc(a, b) {
  return collator.compare(a.title, b.title);
}

function escapeRegExp(str = "") {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

function slicePage(viewings, currentPage, perPage) {
  const skip = perPage * (currentPage - 1);
  return viewings.slice(skip, currentPage * perPage);
}

function sortTitles(titles, sortOrder) {
  const sortMap = {
    "release-date-asc": sortReleaseDateAsc,
    "release-date-desc": sortReleaseDateDesc,
    title: sortTitleAsc,
  };

  const comparer = sortMap[sortOrder];
  return titles.sort(comparer);
}

function filterTitles(titles, filters) {
  return titles.filter((title) => {
    return Object.values(filters).every((filter) => {
      return filter(title);
    });
  });
}

function minMaxReleaseYearsForTitles(titles) {
  const releaseYears = titles
    .map((title) => {
      return title.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  return [minYear, maxYear];
}

function initState({ titles }) {
  const [minYear, maxYear] = minMaxReleaseYearsForTitles(titles);
  const currentPage = 1;
  const perPage = 50;

  return {
    allTitles: titles,
    filteredTitles: titles,
    titlesForPage: slicePage(titles, currentPage, perPage),
    filters: {},
    sortValue: "release-date-asc",
    currentPage,
    perPage,
    minYear,
    maxYear,
  };
}

const actions = {
  FILTER_TITLE: "FILTER_TITLE",
  FILTER_DIRECTOR: "FILTER_DIRECTOR",
  FILTER_PERFORMER: "FILTER_PERFORMER",
  FILTER_WRITER: "FILTER_WRITER",
  FILTER_COLLECTION: "FILTER_COLLECTION",
  FILTER_RELEASE_YEAR: "FILTER_RELEASE_YEAR",
  SORT: "SORT",
  CHANGE_PAGE: "CHANGE_PAGE",
};

function reducer(state, action) {
  let filters;
  let filteredTitles;

  switch (action.type) {
    case actions.FILTER_TITLE: {
      const regex = new RegExp(escapeRegExp(action.value), "i");
      filters = {
        ...state.filters,
        title: (viewing) => {
          return regex.test(viewing.title);
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.FILTER_DIRECTOR: {
      filters = {
        ...state.filters,
        director: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (!title.directorNamesConcat) {
            return false;
          }

          return title.directorNamesConcat.indexOf(action.value) >= 0;
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.FILTER_PERFORMER: {
      filters = {
        ...state.filters,
        performer: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (!title.performerNamesConcat) {
            return false;
          }

          return title.performerNamesConcat.indexOf(action.value) >= 0;
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.FILTER_WRITER: {
      filters = {
        ...state.filters,
        writer: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (!title.writerNamesConcat) {
            return false;
          }

          return title.writerNamesConcat.indexOf(action.value) >= 0;
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.FILTER_COLLECTION: {
      filters = {
        ...state.filters,
        collection: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (!title.collectionNamesConcat) {
            return false;
          }

          return title.collectionNamesConcat.indexOf(action.value) >= 0;
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.FILTER_RELEASE_YEAR: {
      const [minYear, maxYear] = minMaxReleaseYearsForTitles(state.allTitles);
      filters = {
        ...state.filters,
        releaseYear: (viewing) => {
          const releaseYear = parseInt(viewing.year, 10);
          if (action.values === [minYear, maxYear]) {
            return true;
          }
          return (
            releaseYear >= action.values[0] && releaseYear <= action.values[1]
          );
        },
      };
      filteredTitles = sortTitles(
        filterTitles(state.allTitles, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredTitles,
        currentPage: 1,
        titlesForPage: slicePage(filteredTitles, 1, state.perPage),
      };
    }
    case actions.SORT: {
      filteredTitles = sortTitles(state.filteredTitles);
      return {
        ...state,
        sortValue: action.value,
        filteredTitles,
        titlesForPage: slicePage(
          filteredTitles,
          state.currentPage,
          state.perPage
        ),
      };
    }
    case actions.CHANGE_PAGE: {
      return {
        ...state,
        currentPage: action.value,
        titlesForPage: slicePage(
          state.filteredTitles,
          action.value,
          state.perPage
        ),
      };
    }
    default:
      throw new Error();
  }
}

export default function ToWatch({ data }) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      titles: [...data.allWatchlistTitlesJson.nodes],
    },
    initState
  );

  return (
    <Layout>
      <header className="to_watch-header">
        <h2 className="to_watch-heading">To-Watch</h2>
        <p className="to_watch-tagline">
          My movie review bucketlist. {state.allTitles.length.toLocaleString()}{" "}
          titles. No silents or documentaries.
        </p>
      </header>

      <fieldset className="to_watch-filters">
        <legend className="to_watch-filters_header">Filter &amp; Sort</legend>
        <label className="to_watch-label" htmlFor="to_watch-title-input">
          Title
          <DebouncedInput
            id="to_watch-title-input"
            placeholder="Enter all or part of a title"
            onChange={(value) =>
              dispatch({ type: actions.FILTER_TITLE, value })
            }
          />
        </label>
        <label className="to_watch-label" htmlFor="to_watch-director-input">
          Director
          <select
            id="to_watch-director-input"
            onChange={(e) =>
              dispatch({ type: actions.FILTER_DIRECTOR, value: e.target.value })
            }
          >
            <WatchlistOptions
              titles={state.allTitles}
              keyName="directorNamesConcat"
            />
          </select>
        </label>
        <label
          className="to_watch-label"
          htmlFor="to_watch-performer-input"
          bel
        >
          Performer
          <select
            id="to_watch-performer-input"
            onChange={(e) =>
              dispatch({
                type: actions.FILTER_PERFORMER,
                value: e.target.value,
              })
            }
          >
            <WatchlistOptions
              titles={state.allTitles}
              keyName="performerNamesConcat"
            />
          </select>
        </label>
        <label className="to_watch-label" htmlFor="to_watch-writer-input">
          Writer
          <select
            id="to_watch-writer-input"
            onChange={(e) =>
              dispatch({
                type: actions.FILTER_WRITER,
                value: e.target.value,
              })
            }
          >
            <WatchlistOptions
              titles={state.allTitles}
              keyName="writerNamesConcat"
            />
          </select>
        </label>
        <label className="to_watch-label" htmlFor="to_watch-collection-input">
          Collection
          <select
            id="to_watch-collection-input"
            onChange={(e) =>
              dispatch({
                type: actions.FILTER_COLLECTION,
                value: e.target.value,
              })
            }
          >
            <WatchlistOptions
              titles={state.allTitles}
              keyName="collectionNamesConcat"
            />
          </select>
        </label>
        <label className="to_watch-label" htmlFor="to_watch-release-year-input">
          Release Year
          <RangeInput
            id="to_watch-release-year-input"
            min={state.minYear}
            max={state.maxYear}
            onChange={(values) =>
              dispatch({ type: actions.FILTER_RELEASE_YEAR, values })
            }
          />
        </label>
        <label className="to_watch-label" htmlFor="to_watch-sort-input">
          Order By
          <select
            id="to_watch-sort-input"
            onChange={(e) =>
              dispatch({ type: actions.SORT, value: e.target.value })
            }
          >
            <option value="release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="release-date-desc">
              Release Date (Newest First)
            </option>
            <option value="title">Title</option>
          </select>
        </label>
      </fieldset>
      <PaginationHeader
        currentPage={state.currentPage}
        perPage={state.perPage}
        numberOfItems={state.filteredTitles.length}
      />
      <ol className="to_watch-list">
        {state.titlesForPage.map((title) => {
          return (
            <li className="to_watch-watchlist_title">
              <WatchlistTitle title={title} />
              <WatchlistSlug title={title} />
            </li>
          );
        })}
      </ol>
      <Pagination
        currentPage={state.currentPage}
        limit={state.perPage}
        numberOfItems={state.filteredTitles.length}
        onClick={(newPage) =>
          dispatch({ type: actions.CHANGE_PAGE, value: newPage })
        }
      />
    </Layout>
  );
}

ToWatch.propTypes = {
  data: PropTypes.shape({
    allWatchlistTitlesJson: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query {
    allWatchlistTitlesJson(sort: { fields: [year], order: ASC }) {
      nodes {
        directorNamesConcat
        performerNamesConcat
        imdb_id
        title
        writerNamesConcat
        collectionNamesConcat
        year
      }
    }
  }
`;
