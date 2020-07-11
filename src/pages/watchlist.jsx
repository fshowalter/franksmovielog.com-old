import "./watchlist.scss";

import { graphql } from "gatsby";
import React, { useReducer } from "react";
import PropTypes from "prop-types";

import { collator, sortStringAsc, sortStringDesc } from "../utils/sort-utils";
import toSentenceArray from "../utils/to-sentence-array";
import DebouncedInput from "../components/DebouncedInput/DebouncedInput";
import Layout from "../components/Layout";
import Pagination, { PaginationHeader } from "../components/Pagination";
import RangeInput from "../components/RangeInput";
import ReviewLink from "../components/ReviewLink";

function WatchlistOptions({ titles, keyName }) {
  const names = [
    ...new Set(
      titles.flatMap((title) => {
        return title[keyName].map((keyValue) => keyValue.name);
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
    "directors",
    "performers",
    "writers",
    "collections",
  ]).isRequired,
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      directors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      performers: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      writers: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      collections: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
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

function formatPeople(people, suffix) {
  if (people.length === 0) {
    return "";
  }

  const names = people.map((person) => person.name);

  return [`${toSentenceArray(names).join("")} ${suffix}`];
}

function formatCollections(collections) {
  if (collections.length === 0) {
    return "";
  }
  const names = collections.map((collection) => collection.name);

  const suffix = names.length > 1 ? "collections" : "collection";

  return [`it's in the ${toSentenceArray(names)} ${suffix}`];
}

function WatchlistSlug({ title }) {
  const credits = [
    ...formatPeople(title.directors, "directed"),
    ...formatPeople(title.performers, "performed"),
    ...formatPeople(title.writers, "has a writing credit"),
    ...formatCollections(title.collections),
  ];

  return (
    <div className="viewings-viewing_slug">
      Because {toSentenceArray(credits)}.
    </div>
  );
}

WatchlistSlug.propTypes = {
  title: PropTypes.shape({
    directors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    performers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    writers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    collections: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
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

          if (title.directors.length === 0) {
            return false;
          }

          return title.directors.some(
            (director) => director.name === action.value
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
    case actions.FILTER_PERFORMER: {
      filters = {
        ...state.filters,
        performer: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (title.performers.length === 0) {
            return false;
          }

          return title.performers.some(
            (performer) => performer.name === action.value
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
    case actions.FILTER_WRITER: {
      filters = {
        ...state.filters,
        writer: (title) => {
          if (action.value === "All") {
            return true;
          }

          if (title.writers.length === 0) {
            return false;
          }

          return title.writers.some((writer) => writer.name === action.value);
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

          if (title.collections.length === 0) {
            return false;
          }

          return title.collections.some(
            (collection) => collection.name === action.value
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

export default function WatchlistPage({ data }) {
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
            <WatchlistOptions titles={state.allTitles} keyName="directors" />
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
            <WatchlistOptions titles={state.allTitles} keyName="performers" />
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
            <WatchlistOptions titles={state.allTitles} keyName="writers" />
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
            <WatchlistOptions titles={state.allTitles} keyName="collections" />
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

WatchlistPage.propTypes = {
  data: PropTypes.shape({
    allWatchlistTitlesJson: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          imdb_id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          year: PropTypes.number.isRequired,
          directors: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
            })
          ),
          performers: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
            })
          ),
          writers: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
            })
          ),
          collections: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
            })
          ),
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query {
    allWatchlistTitlesJson(sort: { fields: [year], order: ASC }) {
      nodes {
        imdb_id
        title
        year
        directors {
          name
        }
        performers {
          name
        }
        writers {
          name
        }
        collections {
          name
        }
      }
    }
  }
`;
