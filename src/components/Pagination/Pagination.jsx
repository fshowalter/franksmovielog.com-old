import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import "./pagination.scss";

export function PaginationHeader({
  className,
  currentPage,
  perPage,
  numberOfItems,
}) {
  const start = currentPage * perPage - perPage || 1;
  const max = currentPage * perPage;
  const end = max < numberOfItems ? max : numberOfItems;

  return (
    <p className={className}>
      Showing {start}-{end} of {numberOfItems}.
    </p>
  );
}

PaginationHeader.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  numberOfItems: PropTypes.number.isRequired,
};

PaginationHeader.defaultProps = {
  className: null,
};

export default function Footer({
  currentPage,
  urlRoot,
  onClick,
  limit,
  numberOfItems,
}) {
  const useButton = !!onClick;

  const numPages = Math.ceil(numberOfItems / limit);

  if (numPages === 1) {
    return null;
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  const prevPageUrl =
    currentPage === 2 ? `${urlRoot}` : `${urlRoot}page-${currentPage - 1}/`;

  const nextPageUrl = `${urlRoot}page-${currentPage + 1}/`;

  let prev;

  if (isFirst) {
    prev = useButton ? (
      <button
        type="button"
        disabled
        className="pagination-prev pagination-placeholder"
      >
        ←Prev
      </button>
    ) : (
      <span className="pagination-prev pagination-placeholder">←Prev</span>
    );
  } else {
    prev = useButton ? (
      <button
        type="button"
        onClick={() => onClick(currentPage - 1)}
        className="pagination-prev pagination-button"
      >
        ←Prev
      </button>
    ) : (
      <Link className="pagination-prev pagination-link" to={prevPageUrl}>
        ←Prev
      </Link>
    );
  }

  let next;

  if (isLast) {
    next = useButton ? (
      <button
        type="button"
        disabled
        className="pagination-next pagination-placeholder"
      >
        Next→
      </button>
    ) : (
      <span className="pagination-next pagination-placeholder">Next→</span>
    );
  } else {
    next = useButton ? (
      <button
        type="button"
        onClick={() => onClick(currentPage + 1)}
        className="pagination-next pagination-button"
      >
        Next→
      </button>
    ) : (
      <Link className="pagination-next pagination-link" to={nextPageUrl}>
        Next→
      </Link>
    );
  }

  let firstPage = "";

  if (currentPage - 1 > 1) {
    firstPage = useButton ? (
      <button
        type="button"
        onClick={() => onClick(1)}
        className="pagination-button"
      >
        1
      </button>
    ) : (
      <Link className="pagination-link" to={`${urlRoot}`}>
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
    prevPage = useButton ? (
      <button
        type="button"
        onClick={() => onClick(currentPage - 1)}
        className="pagination-button"
      >
        {currentPage - 1}
      </button>
    ) : (
      <Link className="pagination-link" to={prevPageUrl}>
        {currentPage - 1}
      </Link>
    );
  }

  let nextPage = "";

  if (isLast) {
    nextPage = <span className="pagination-placeholder" />;
  } else {
    nextPage = useButton ? (
      <button
        type="button"
        onClick={() => onClick(currentPage + 1)}
        className="pagination-button"
      >
        {currentPage + 1}
      </button>
    ) : (
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
    lastPage = useButton ? (
      <button
        type="button"
        onClick={() => onClick(numPages)}
        className="pagination-button"
      >
        {numPages}
      </button>
    ) : (
      <Link className="pagination-link" to={`${urlRoot}page-${numPages}/`}>
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

Footer.propTypes = {
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  numberOfItems: PropTypes.number.isRequired,
  onClick: (props, propName) => {
    const { [propName]: onClick, urlRoot } = props;
    if (!urlRoot && (!onClick || typeof onClick !== "function")) {
      return new Error("Please provide a onClick function or urlRoot.");
    }

    return null;
  },
  urlRoot: PropTypes.string,
};

Footer.defaultProps = {
  onClick: null,
  urlRoot: null,
};
