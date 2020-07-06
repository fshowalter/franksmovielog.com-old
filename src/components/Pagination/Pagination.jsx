import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import "./pagination.scss";

export default function Pagination({
  currentPage,
  urlRoot,
  limit,
  numberOfItems,
  query,
}) {
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
      ? `${urlRoot}${queryString}`
      : `${urlRoot}page-${currentPage - 1}/${queryString}`;

  const nextPageUrl = `${urlRoot}page-${currentPage + 1}/${queryString}`;

  let prev;

  if (isFirst) {
    prev = (
      <span className="pagination-prev pagination-placeholder">←Prev</span>
    );
  } else {
    prev = (
      <Link className="pagination-prev pagination-link" to={prevPageUrl}>
        ←Prev
      </Link>
    );
  }

  let next;

  if (isLast) {
    next = (
      <span className="pagination-next pagination-placeholder">Next→</span>
    );
  } else {
    next = (
      <Link className="pagination-next pagination-ink" to={nextPageUrl}>
        Next→
      </Link>
    );
  }

  let firstPage = "";

  if (currentPage - 1 > 1) {
    firstPage = (
      <Link className="pagination-link" to={`${urlRoot}${queryString}`}>
        1
      </Link>
    );
  }

  let prevDots = "";

  if (currentPage - 2 > 1) {
    prevDots = <span className="pagination-elipsis">…</span>;
  }

  let prevPage = "";

  if (!isFirst) {
    prevPage = (
      <Link className="pagination-link" to={prevPageUrl}>
        {currentPage - 1}
      </Link>
    );
  }

  let nextPage = "";

  if (isLast) {
    nextPage = <span className="pagination-placeholder" />;
  } else {
    nextPage = (
      <Link class="pagination-link" to={nextPageUrl}>
        {currentPage + 1}
      </Link>
    );
  }

  let nextDots = "";

  if (currentPage + 2 < numPages) {
    nextDots = <span className="pagination-elipsis">…</span>;
  }

  let lastPage = "";

  if (currentPage + 1 < numPages) {
    lastPage = (
      <Link
        className="pagination-link"
        to={`${urlRoot}page-${numPages}/${queryString}`}
      >
        {numPages}
      </Link>
    );
  }

  return (
    <section className="pagination">
      <h3 className="pagination-heading">Pagination</h3>
      {prev} {firstPage} {prevDots} {prevPage}
      <span className="pagination-current_page" aria-current="page">
        {currentPage}
      </span>
      {nextPage} {nextDots} {lastPage} {next}
    </section>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  numberOfItems: PropTypes.number.isRequired,
  query: PropTypes.objectOf(PropTypes.string),
  urlRoot: PropTypes.string.isRequired,
};

Pagination.defaultProps = {
  query: {},
};
