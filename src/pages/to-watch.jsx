import "./to-watch.scss";

import { graphql } from "gatsby";
import React, { useReducer } from "react";
import { format, parseISO } from "date-fns";
import PropTypes from "prop-types";

import { collator, sortStringAsc, sortStringDesc } from "../utils/sort-utils";
import DebouncedInput from "../components/DebouncedInput/DebouncedInput";
import Layout from "../components/Layout";
import Pagination, { PaginationHeader } from "../components/Pagination";
import RangeInput from "../components/RangeInput";
import ReviewLink from "../components/ReviewLink";

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

function WatchlistSlug({ viewing }) {
  return (
    <div className="viewings-viewing_slug">
      {format(parseISO(viewing.date), "EEEE LLL d, yyyy")} via {viewing.venue}.
    </div>
  );
}

WatchlistSlug.propTypes = {
  viewing: PropTypes.shape({
    date: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
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

function slicePage(viewings, currentPage, perPage) {
  const skip = perPage * (currentPage - 1);
  return viewings.slice(skip, currentPage * perPage);
}

function filterAndSortViewings(viewings, filters, sortOrder) {
  const sortMap = {
    "release-date-asc": sortReleaseDateAsc,
    "release-date-desc": sortReleaseDateDesc,
    title: sortTitleAsc,
  };

  const filteredViewings = viewings.filter((viewing) => {
    return Object.values(filters).every((filter) => {
      return filter(viewing);
    });
  });

  const comparer = sortMap[sortOrder];
  return filteredViewings.sort(comparer);
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
    currentPage,
    perPage,
    minYear,
    maxYear,
  };
}

const actions = {
  FILTER_TITLE: "FILTER_TITLE",
  FILTER_VENUE: "FILTER_VENUE",
  FILTER_RELEASE_YEAR: "FILTER_RELEASE_YEAR",
  SORT: "SORT",
  CHANGE_PAGE: "CHANGE_PAGE",
};

function reducer(state, action) {
  let filters;
  let filteredViewings;

  switch (action.type) {
    case actions.FILTER_TITLE: {
      const regex = new RegExp(escapeRegExp(action.value), "i");
      filters = {
        ...state.filters,
        title: (viewing) => {
          return regex.test(viewing.title);
        },
      };
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        filters,
        state.sortValue
      );
      return {
        ...state,
        titleValue: action.value,
        filters,
        query,
        filteredViewings,
        viewingsForPage: slicePage(
          filteredViewings,
          state.currentPage,
          state.perPage
        ),
      };
    }
    case actions.FILTER_VENUE: {
      filters = {
        ...state.filters,
        venue: (viewing) => {
          if (action.value === "All") {
            return true;
          }

          return viewing.venue === action.value;
        },
      };
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        filters,
        state.sortValue
      );
      return {
        ...state,
        venueValue: action.value,
        filters,
        query,
        filteredViewings,
        viewingsForPage: slicePage(
          filteredViewings,
          state.currentPage,
          state.perPage
        ),
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
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        filters,
        state.sortValue
      );
      return {
        ...state,
        releaseYearValues: action.values,
        filters,
        filteredViewings,
        viewingsForPage: slicePage(
          filteredViewings,
          state.currentPage,
          state.perPage
        ),
      };
    }
    case actions.SORT: {
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        state.filters,
        action.value
      );
      return {
        ...state,
        sortValue: action.value,
        filteredViewings,
        viewingsForPage: slicePage(
          filteredViewings,
          state.currentPage,
          state.perPage
        ),
      };
    }
    case actions.CHANGE_PAGE: {
      return {
        ...state,
        currentPage: action.value,
        viewingsForPage: slicePage(
          state.filteredViewings,
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
