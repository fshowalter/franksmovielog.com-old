import "./viewings.scss";

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

function VenueOptions({ viewings }) {
  const venues = Array.from(
    new Set(viewings.map((viewing) => viewing.venue))
  ).sort((a, b) => collator.compare(a, b));

  return (
    <>
      <option key="all" value="All">
        All
      </option>
      {venues.map((venue) => (
        <option key={venue} value={venue}>
          {venue}
        </option>
      ))}
    </>
  );
}

VenueOptions.propTypes = {
  viewings: PropTypes.arrayOf(
    PropTypes.shape({
      venue: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function ViewingTitle({ viewing }) {
  return (
    <div className="viewings-viewing_title">
      <ReviewLink imdbId={viewing.imdb_id} className="viewings-viewing_link">
        <>
          {viewing.title}{" "}
          <span className="viewings-viewing_title_year">{viewing.year}</span>
        </>
      </ReviewLink>
    </div>
  );
}

ViewingTitle.propTypes = {
  viewing: PropTypes.shape({
    imdb_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
};

function ViewingSlug({ viewing }) {
  return (
    <div className="viewings-viewing_slug">
      {format(parseISO(viewing.date), "EEEE LLL d, yyyy")} via {viewing.venue}.
    </div>
  );
}

ViewingSlug.propTypes = {
  viewing: PropTypes.shape({
    date: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
  }).isRequired,
};

function sortViewingDateAsc(a, b) {
  return sortStringAsc(a.date, b.date);
}

function sortViewingDateDesc(a, b) {
  return sortStringDesc(a.date, b.date);
}

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
    allViewingsJson(sort: { fields: [sequence], order: DESC }) {
      nodes {
        sequence
        date(formatString: "YYYY-MM-DD")
        imdb_id
        title
        venue
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
    "viewing-date-desc": sortViewingDateDesc,
    "viewing-date-asc": sortViewingDateAsc,
    "release-date-desc": sortReleaseDateDesc,
    "release-date-asc": sortReleaseDateAsc,
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

function minMaxReleaseYearsForViewings(viewings) {
  const releaseYears = viewings
    .map((viewing) => {
      return viewing.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  return [minYear, maxYear];
}

function initState({ viewings }) {
  const [minYear, maxYear] = minMaxReleaseYearsForViewings(viewings);
  const currentPage = 1;
  const perPage = 50;

  return {
    allViewings: viewings,
    filteredViewings: viewings,
    viewingsForPage: slicePage(viewings, currentPage, perPage),
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
      const [minYear, maxYear] = minMaxReleaseYearsForViewings(
        state.allViewings
      );
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

export default function Viewings({ data }) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      viewings: [...data.allViewingsJson.nodes],
    },
    initState
  );

  return (
    <Layout>
      <header className="viewings-header">
        <h2 className="viewings-heading">Viewing Log</h2>
        <p className="viewings-tagline">
          I&apos;ve watched {state.allViewings.length} movies since 2012.
        </p>
      </header>

      <fieldset className="viewings-filters">
        <legend className="viewings-filters_header">Filter &amp; Sort</legend>
        <label className="viewings-label" htmlFor="viewings-title-input">
          Title
          <DebouncedInput
            id="viewings-title-input"
            placeholder="Enter all or part of a title"
            onChange={(value) =>
              dispatch({ type: actions.FILTER_TITLE, value })
            }
          />
        </label>
        <label className="viewings-label" htmlFor="viewings-release-year-input">
          Release Year
          <RangeInput
            id="viewings-release-year-input"
            min={state.minYear}
            max={state.maxYear}
            onChange={(values) =>
              dispatch({ type: actions.FILTER_RELEASE_YEAR, values })
            }
          />
        </label>
        <label className="viewings-label" htmlFor="viewings-venue-input">
          Venue
          <select
            id="viewings-venue-input"
            onChange={(e) =>
              dispatch({ type: actions.FILTER_VENUE, value: e.target.value })
            }
          >
            <VenueOptions viewings={state.allViewings} />
          </select>
        </label>
        <label className="viewings-label" htmlFor="viewings-sort-input">
          Order By
          <select
            value={state.sortValue}
            id="viewings-sort-input"
            onChange={(e) =>
              dispatch({ type: actions.SORT, value: e.target.value })
            }
          >
            <option value="viewing-date-desc">
              Viewing Date (Newest First)
            </option>
            <option value="viewing-date-asc">
              Viewing Date (Oldest First)
            </option>
            <option value="release-date-desc">
              Release Date (Newest First)
            </option>
            <option value="release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="title">Title</option>
          </select>
        </label>
      </fieldset>
      <PaginationHeader
        currentPage={state.currentPage}
        perPage={state.perPage}
        numberOfItems={state.filteredViewings.length}
      />
      <ol className="viewings-list">
        {state.viewingsForPage.map((viewing) => {
          return (
            <li value={viewing.sequence} className="viewings-viewing">
              <ViewingTitle viewing={viewing} />
              <ViewingSlug viewing={viewing} />
            </li>
          );
        })}
      </ol>
      <Pagination
        currentPage={state.currentPage}
        limit={state.perPage}
        numberOfItems={state.filteredViewings.length}
        onClick={(newPage) =>
          dispatch({ type: actions.CHANGE_PAGE, value: newPage })
        }
      />
    </Layout>
  );
}

Viewings.propTypes = {
  data: PropTypes.shape({
    allViewingsJson: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
};
