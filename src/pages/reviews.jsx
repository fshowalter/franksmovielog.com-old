import "./viewings.scss";

import { graphql } from "gatsby";
import React, { useReducer } from "react";
import { format, parseISO } from "date-fns";
import PropTypes from "prop-types";

import { collator, sortStringAsc, sortStringDesc } from "../utils/sort-utils";
import DebouncedInput from "../components/DebouncedInput/DebouncedInput";
import Layout from "../components/Layout";
import RangeInput from "../components/RangeInput";
import ReviewLink from "../components/ReviewLink";
import Pagination from "../components/Pagination";

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

function filterReviews(viewings, filters) {
  return viewings.filter((viewing) => {
    return Object.values(filters).every((filter) => {
      return filter(viewing);
    });
  });
}

function sortReviews(viewings, sortOrder) {
  const sortMap = {
    title: sortTitleAsc,
    "release-date-desc": sortReleaseDateDesc,
    "release-date-asc": sortReleaseDateAsc,
  };

  const comparer = sortMap[sortOrder];
  return viewings.sort(comparer);
}

function minMaxReleaseYearsForReviews(viewings) {
  const releaseYears = viewings
    .map((viewing) => {
      return viewing.year;
    })
    .sort();

  const minYear = parseInt(releaseYears[0], 10);
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10);

  return [minYear, maxYear];
}

function initState({ reviews }) {
  const [minYear, maxYear] = minMaxReleaseYearsForReviews(reviews);
  const currentPage = 1;
  const perPage = 100;

  return {
    allReviews: reviews,
    filteredReviews: reviews,
    reviewsForPage: slicePage(reviews, currentPage, perPage),
    filters: {},
    currentPage,
    perPage,
    minYear,
    maxYear,
  };
}

const actions = {
  FILTER_TITLE: "FILTER_TITLE",
  FILTER_GRADE: "FILTER_GRADE",
  FILTER_RELEASE_YEAR: "FILTER_RELEASE_YEAR",
  SORT: "SORT",
  CHANGE_PAGE: "CHANGE_PAGE",
};

function reducer(state, action) {
  let filters;
  let filteredReviews;

  switch (action.type) {
    case actions.FILTER_TITLE: {
      const regex = new RegExp(escapeRegExp(action.value), "i");
      filters = {
        ...state.filters,
        title: (review) => {
          return regex.test(review.title);
        },
      };
      filteredReviews = sortReviews(
        filterReviews(state.allReviews, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
        currentPage: 1,
        reviewsForPage: slicePage(filteredReviews, 1, state.perPage),
      };
    }
    case actions.FILTER_RELEASE_YEAR: {
      const [minYear, maxYear] = minMaxReleaseYearsForReviews(state.allReviews);
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
      filteredReviews = sortReviews(
        filterReviews(state.allReviews, filters),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
        currentPage: 1,
        reviewsForPage: slicePage(filteredReviews, 1, state.perPage),
      };
    }
    case actions.SORT: {
      filteredReviews = sortReviews(state.filteredReviews, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredReviews,
        reviewsForPage: slicePage(
          filteredReviews,
          state.currentPage,
          state.perPage
        ),
      };
    }
    case actions.CHANGE_PAGE: {
      return {
        ...state,
        currentPage: action.value,
        reviewsForPage: slicePage(
          state.filteredReviews,
          action.value,
          state.perPage
        ),
      };
    }
    default:
      throw new Error();
  }
}

export default function ReviewsPage({ data }) {
  const [state, dispatch] = useReducer(
    reducer,
    {
      reviews: [...data.reviews.nodes],
    },
    initState
  );

  return (
    <Layout>
      <header className="viewings-header">
        <h2 className="viewings-heading">Reviews</h2>
        <p className="viewings-tagline">
          I&apos;ve published {state.allReviews.length} reviews since 2020.
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
          Grade
          <RangeInput
            id="viewings-release-year-input"
            min={1}
            max={5}
            options={
              <>
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★</option>
              </>
            }
            onChange={(values) =>
              dispatch({ type: actions.FILTER_GRADE, values })
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
        <label className="viewings-label" htmlFor="viewings-sort-input">
          Order By
          <select
            value={state.sortValue}
            id="viewings-sort-input"
            onChange={(e) =>
              dispatch({ type: actions.SORT, value: e.target.value })
            }
          >
            <option value="title">Title</option>
            <option value="release-date-desc">
              Release Date (Newest First)
            </option>
            <option value="release-date-asc">
              Release Date (Oldest First)
            </option>
          </select>
        </label>
      </fieldset>
      <ol className="viewings-list">
        {state.reviewsForPage.map((review) => {
          return (
            <li value={review.sequence} className="viewings-viewing">
              <ViewingTitle viewing={review} />
              <ViewingSlug viewing={review} />
            </li>
          );
        })}
      </ol>
      <Pagination
        currentPage={state.currentPage}
        limit={state.perPage}
        numberOfItems={state.filteredReviews.length}
        onClick={(newPage) =>
          dispatch({ type: actions.CHANGE_PAGE, value: newPage })
        }
      />
    </Layout>
  );
}

ReviewsPage.propTypes = {
  data: PropTypes.shape({
    reviews: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query {
    reviews: allReviewsJson(sort: { fields: [sort_title], order: ASC }) {
      nodes {
        sequence
        date(formatString: "YYYY-MM-DD")
        imdb_id
        title
        year
        grade_value
        sort_title
      }
    }
  }
`;
