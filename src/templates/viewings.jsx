import "./viewings.scss";

import { Link, graphql } from "gatsby";
import React, { useEffect, useReducer, useRef } from "react";
import { format, parseISO } from "date-fns";
import queryString from "query-string";

import { collator, sortStringAsc, sortStringDesc } from "../components/Sorter";
import DebouncedInput from "../components/DebouncedInput";
import Layout from "../components/Layout";
import RangeFilter from "../components/RangeFilter";
import ReviewLink from "../components/ReviewLink";

function ReleaseYearFilter({ label, viewings, values, onChange }) {
  const [minYear, maxYear] = minMaxReleaseYearsForViewings(viewings);

  return (
    <RangeFilter
      label={label}
      min={minYear}
      max={maxYear}
      values={values}
      onChange={onChange}
    />
  );
}

function venueSelect(viewings, onChange, selected) {
  const collator = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  });

  const venues = Array.from(
    new Set(viewings.map((viewing) => viewing.venue))
  ).sort((a, b) => collator.compare(a, b));

  const options = [<option key="all">All</option>].concat(
    Array.from(
      new Set(
        viewings.map((viewing) => {
          return <option>{viewing.venue}</option>;
        })
      )
    ).sort((a, b) => {
      return collator.compare(a, b);
    })
  );
  return (
    <select value={selected} onChange={(e) => onChange(e.target.value)}>
      <option key="All" value="All">
        All
      </option>
      {venues.map((venue) => (
        <option key={venue} value={venue}>
          {venue}
        </option>
      ))}
    </select>
  );
}

function titleForViewing(viewing) {
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

function slugForViewing(viewing) {
  return (
    <div className="viewings-viewing_slug">
      {format(parseISO(viewing.date), "EEEE LLL d, yyyy")} via {viewing.venue}.
    </div>
  );
}

function buildPagination(currentPage, limit, numberOfItems, query) {
  const numPages = Math.ceil(numberOfItems / limit);

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  let queryString = "";

  if (Object.keys(query).length) {
    queryString = `?${Object.keys(query)
      .map((key) => {
        return `${key}=${query[key]}`;
      })
      .join("&")}`;
  }

  const prevPageUrl =
    currentPage === 2
      ? `/viewings/${queryString}`
      : `/viewings/page-${currentPage - 1}/${queryString}`;

  const nextPageUrl = `/viewings/page-${currentPage + 1}/${queryString}`;

  let prev;

  if (isFirst) {
    prev = (
      <span className="home_pagination__prev home_pagination__placeholder">
        ←Prev
      </span>
    );
  } else {
    prev = (
      <Link
        className="home_pagination__prev home_pagination__link"
        to={prevPageUrl}
      >
        ←Prev
      </Link>
    );
  }

  let next;

  if (isLast) {
    next = (
      <span className="home_pagination__next home_pagination__placeholder">
        Next→
      </span>
    );
  } else {
    next = (
      <Link
        className="home_pagination__next home_pagination__link"
        to={nextPageUrl}
      >
        Next→
      </Link>
    );
  }

  let firstPage = "";

  if (currentPage - 1 > 1) {
    firstPage = (
      <Link className="home_pagination__link" to={`/viewings/${queryString}`}>
        1
      </Link>
    );
  }

  let prevDots = "";

  if (currentPage - 2 > 1) {
    prevDots = <span className="home_pagination__elipsis">…</span>;
  }

  let prevPage = "";

  if (!isFirst) {
    prevPage = (
      <Link className="home_pagination__link" to={prevPageUrl}>
        {currentPage - 1}
      </Link>
    );
  }

  let nextPage = "";

  if (isLast) {
    nextPage = <span className="home_pagination__placeholder"></span>;
  } else {
    nextPage = (
      <Link class="home_pagination__link" to={nextPageUrl}>
        {currentPage + 1}
      </Link>
    );
  }

  let nextDots = "";

  if (currentPage + 2 < numPages) {
    nextDots = <span class="home_pagination__elipsis">…</span>;
  }

  let lastPage = "";

  if (currentPage + 1 < numPages) {
    lastPage = (
      <Link
        className="home_pagination__link"
        to={`/viewings/page-${numPages}/${queryString}`}
      >
        {numPages}
      </Link>
    );
  }

  return (
    <section class="home_pagination">
      <h3 class="home_pagination__heading">Pagination</h3>
      {prev} {firstPage} {prevDots} {prevPage}
      <span class="home_pagination__current_page" aria-current="page">
        {currentPage}
      </span>
      {nextPage} {nextDots} {lastPage} {next}
    </section>
  );
}

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

function parseQueryString() {
  const inBrowser = typeof document !== "undefined";

  if (inBrowser) {
    return document.location.search
      ? queryString.parse(document.location.search)
      : {};
  } else {
    return {};
  }
}

function slicePage(viewings, skip, limit) {
  return viewings.slice(skip, skip + limit);
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

function initState({ viewings, skip, limit }) {
  return {
    allViewings: viewings,
    filteredViewings: viewings,
    viewingsForPage: slicePage(viewings, skip, limit),
    titleValue: "",
    venueValue: "All",
    sortValue: "viewing-date-desc",
    releaseYearValues: minMaxReleaseYearsForViewings(viewings),
    query: {},
    filters: {},
    skip: skip,
    limit: limit,
  };
}

function reducer(state, action) {
  let filters, query, filteredViewings;

  switch (action.type) {
    case "filterTitle":
      const regex = new RegExp(escapeRegExp(action.value), "i");
      filters = {
        ...state.filters,
        title: (viewing) => {
          return regex.test(viewing.title);
        },
      };
      query = { ...state.query, title: action.value };
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
        viewingsForPage: slicePage(filteredViewings, state.skip, state.limit),
      };
    case "filterVenue":
      filters = {
        ...state.filters,
        venue: (viewing) => {
          if (action.value === "All") {
            return true;
          }

          return viewing.venue === action.value;
        },
      };
      query = { ...state.query, venue: action.value };
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
        viewingsForPage: slicePage(filteredViewings, state.skip, state.limit),
      };
    case "filterReleaseYear":
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
      query = { ...state.query, releaseYear: action.values };
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        filters,
        state.sortValue
      );
      return {
        ...state,
        releaseYearValues: action.values,
        filters,
        query,
        filteredViewings,
        viewingsForPage: slicePage(filteredViewings, state.skip, state.limit),
      };
    case "sort":
      query = { ...state.query, sort: action.value };
      filteredViewings = filterAndSortViewings(
        state.allViewings,
        state.filters,
        action.value
      );
      return {
        ...state,
        sortValue: action.value,
        query,
        filteredViewings,
        viewingsForPage: slicePage(filteredViewings, state.skip, state.limit),
      };
  }
}

export default function Viewings({ data, pageContext }) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      viewings: [...data.allViewingsJson.nodes],
      skip: pageContext.skip,
      limit: pageContext.limit,
    },
    initState
  );

  const hasParsedQueryString = useRef(false);

  useEffect(() => {
    if (hasParsedQueryString.current) {
      return;
    }
    console.log("querystring effect");

    const parsedQueryString = parseQueryString();

    console.log(parsedQueryString);

    const venueQueryStringValue = parsedQueryString["venue"];

    if (venueQueryStringValue) {
      dispatch({ type: "filterVenue", value: venueQueryStringValue });
    }

    const titleQueryStringValue = parsedQueryString["title"];

    if (titleQueryStringValue) {
      dispatch({ type: "filterTitle", value: titleQueryStringValue });
    }

    const releaseYearQueryStringValues = parsedQueryString["releaseYear"];

    if (releaseYearQueryStringValues) {
      dispatch({
        type: "filterReleaseYear",
        values: releaseYearQueryStringValues.split(","),
      });
    }

    const sortQueryStringValue = parsedQueryString["sort"];

    if (sortQueryStringValue) {
      dispatch({ type: "sort", value: sortQueryStringValue });
    }

    hasParsedQueryString.current = true;
  });

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
        <label className="viewings-label">
          Title
          <DebouncedInput
            placeholder="Enter all or part of a title"
            value={state.titleValue}
            onChange={(value) =>
              dispatch({ type: "filterTitle", value: value })
            }
          />
        </label>
        <ReleaseYearFilter
          label="Release Year"
          viewings={state.allViewings}
          values={state.releaseYearValues}
          onChange={(values) =>
            dispatch({ type: "filterReleaseYear", values: values })
          }
        />
        <label className="viewings-label">
          Venue{" "}
          {venueSelect(
            state.allViewings,
            (value) => dispatch({ type: "filterVenue", value: value }),
            state.venueValue
          )}
        </label>
        <label className="viewings-label">
          Order By
          <select
            value={state.sortValue}
            onChange={(e) => dispatch({ type: "sort", value: e.target.value })}
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
      <ol className="viewings-list">
        {state.viewingsForPage.map((viewing) => {
          return (
            <li value={viewing.sequence} className="viewings-viewing">
              {titleForViewing(viewing)}
              {slugForViewing(viewing)}
            </li>
          );
        })}
      </ol>
      {buildPagination(
        pageContext.currentPage,
        pageContext.limit,
        state.filteredViewings.length,
        state.query
      )}
    </Layout>
  );
}
