import { graphql, Link } from "gatsby"
import React from "react"

import Layout from "../components/Layout"
import ListItemWithSlug from "../components/ListItemWithSlug"
import RangeFilter from "../components/RangeFilter"
import SelectFilter from "../components/SelectFilter"
import Sorter, {
  collator,
  sortStringAsc,
  sortStringDesc,
} from "../components/Sorter"
import TextFilter from "../components/TextFilter"
import { format, parseISO } from "date-fns"
import queryString from "query-string"

const matchers = {}

function buildSlug(node) {
  return `${format(node.date, "dddd MMM D, YYYY")} via ${node.venue}.`
}

function ViewingYearSelectFilter({ label, viewings, onChange }) {
  const yearOptions = [
    ...new Set(
      viewings.map(viewing => {
        return viewing.date.substring(0, 4)
      })
    ),
  ]
    .sort()
    .map(year => {
      return [year, year]
    })

  const handleChange = value => {
    onChange("viewingYear", viewing => {
      if (value === "All") {
        return true
      }

      return viewing.date.startsWith(value)
    })
  }

  return (
    <SelectFilter onChange={handleChange} label={label}>
      {yearOptions}
    </SelectFilter>
  )
}

function VenueFilter({ label, viewings, onChange }) {
  const venues = [
    ...new Set(
      viewings.map(viewing => {
        return viewing.venue
      })
    ),
  ].sort()

  const venueOptions = venues.map(venue => {
    return [venue, venue]
  })

  const handleChange = value => {
    onChange("venue", viewing => {
      if (value === "All") {
        return true
      }

      return viewing.venue === value
    })
  }

  return (
    <SelectFilter onChange={handleChange} label={label}>
      {venueOptions}
    </SelectFilter>
  )
}

function escapeRegExp(str = "") {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
}

function TitleFilter({ label, placeholder, onChange }) {
  const handleChange = value => {
    const regex = new RegExp(escapeRegExp(value), "i")
    onChange("title", viewing => {
      return regex.test(viewing.movie.title)
    })
  }

  return (
    <TextFilter
      label={label}
      placeholder={placeholder}
      handleChange={handleChange}
    />
  )
}

function ViewingSorter({ label, viewings, onChange }) {
  const sortViewingDateAsc = (a, b) => {
    return sortStringAsc(a.date, b.date)
  }

  const sortViewingDateDesc = (a, b) => {
    return sortStringDesc(a.date, b.date)
  }

  const sortReleaseDateAsc = (a, b) => {
    return sortStringAsc(a.movie.year, b.movie.year)
  }

  const sortReleaseDateDesc = (a, b) => {
    return sortStringDesc(a.movie.year, b.movie.year)
  }

  const sortTitleAsc = (a, b) => {
    return collator.compare(a.movie.sortTitle, b.movie.sortTitle)
  }

  const handleChange = sortedViewings => {
    onChange(sortedViewings)
  }

  return (
    <Sorter label={label} collection={viewings} onChange={handleChange}>
      {{
        "Viewing Date (Newest First)": sortViewingDateDesc,
        "Viewing Date (Oldest First)": sortViewingDateAsc,
        "Release Date (Newest First)": sortReleaseDateDesc,
        "Release Date (Oldest First)": sortReleaseDateAsc,
        Title: sortTitleAsc,
      }}
    </Sorter>
  )
}

function FilterPanel({ state, setState, heading }) {
  const onFilterChange = (filterId, matcher) => {
    matchers[filterId] = matcher

    const viewings = state.viewings.map(viewing => {
      const match = !Object.values(matchers).some(filterMatcher => {
        return !filterMatcher(viewing)
      })

      if (match === viewing.match) {
        return viewing
      }

      return { ...viewing, match }
    })
    setState({ ...state, viewings })
  }

  const onSortChange = sortedViewings => {
    setState({ ...state, viewings: sortedViewings })
  }

  return (
    <div heading={heading}>
      <TitleFilter
        onChange={onFilterChange}
        label="Title"
        placeholder="Enter all or part of a title."
      />
      <ReleaseYearFilter
        label="Release Year"
        viewings={state.viewings}
        onChange={onFilterChange}
      />
      <ViewingYearSelectFilter
        label="Viewing Year"
        viewings={state.viewings}
        onChange={onFilterChange}
      />
      <VenueFilter
        label="Venue"
        viewings={state.viewings}
        onChange={onFilterChange}
      />
      <ViewingSorter
        label="Order By"
        viewings={state.viewings}
        onChange={onSortChange}
      />
    </div>
  )
}

function ReleaseYearFilter({ label, viewings, onChange }) {
  const releaseYears = viewings
    .map(viewing => {
      return viewing.movie.year
    })
    .sort()

  const minYear = parseInt(releaseYears[0], 10)
  const maxYear = parseInt(releaseYears[releaseYears.length - 1], 10)

  const handleChange = values => {
    onChange("releaseYear", viewing => {
      if (values === [minYear, maxYear]) {
        return true
      }

      const value = parseInt(viewing.movie.year, 10)
      return value >= values[0] && value <= values[1]
    })
  }

  return (
    <RangeFilter
      label={label}
      min={minYear}
      max={maxYear}
      handleChange={handleChange}
    />
  )
}

const ViewingListItem = React.memo(function (viewing) {
  return (
    <ListItemWithSlug
      visible={viewing.match}
      title={`${viewing.movie.title} (${viewing.movie.year})`}
      slug={buildSlug(viewing)}
    />
  )
})

function reviewLink(imdbId, text, className) {
  const review = reviews.find(review => review.imdb_id === imdbId)

  if (!review) {
    return text
  }

  return (
    <Link className="${className}" to={`/reviews/${review.slug}/`}>
      {text}
    </Link>
  )
}

function releaseYearFilter(viewings) {
  const sortedViewings = [...viewings].sort((a, b) => {
    return a.year - b.year
  })

  const min = sortedViewings[0].year
  const max = sortedViewings[sortedViewings.length - 1].year
  return (
    <div>
      <input type="number" min={min} max={max} value={min} />
      &nbsp;to&nbsp;
      <input type="number" min={min} max={max} value={max} />
    </div>
  )
}

function venueSelect(viewings) {
  const collator = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  })

  const venues = Array.from(
    new Set(viewings.map(viewing => viewing.venue))
  ).sort((a, b) => collator.compare(a, b))

  const options = [<option key="all">All</option>].concat(
    Array.from(
      new Set(
        viewings.map(viewing => {
          return <option>{viewing.venue}</option>
        })
      )
    ).sort((a, b) => {
      return collator.compare(a, b)
    })
  )

  return (
    <select>
      <option key="all">All</option>
      {venues.map(venue => (
        <option>{venue}</option>
      ))}
    </select>
  )
}

function titleForViewing(viewing) {
  return (
    <div class="viewings_viewing__title">
      {reviewLink(
        viewing.imdb_id,
        <>
          {viewing.title}{" "}
          <span className="viewings_viewing__title_year">{viewing.year}</span>
        </>,
        "viewings_viewing__link"
      )}
    </div>
  )
}

function slugForViewing(viewing) {
  return (
    <div class="viewings_viewing__slug">
      {format(parseISO(viewing.date), "EEEE LLL d, yyyy")} via {viewing.venue}.
    </div>
  )
}

function buildPagination({ currentPage, numPages }, query) {
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  let queryString = ""

  if (Object.keys(query).length) {
    queryString = `?${Object.keys(query)
      .map(key => {
        return `${key}=${query[key]}`
      })
      .join("&")}`
  }

  const prevPageUrl =
    currentPage === 2 ? "/viewings/" : `/viewings/page-${currentPage - 1}/`

  const nextPageUrl = `/viewings/page-${currentPage + 1}/${queryString}`

  let prev

  if (isFirst) {
    prev = (
      <span className="home_pagination__prev home_pagination__placeholder">
        ←Prev
      </span>
    )
  } else {
    prev = (
      <Link
        className="home_pagination__prev home_pagination__link"
        to={prevPageUrl}
      >
        ←Prev
      </Link>
    )
  }

  let next

  if (isLast) {
    next = (
      <span className="home_pagination__next home_pagination__placeholder">
        Next→
      </span>
    )
  } else {
    next = (
      <Link
        className="home_pagination__next home_pagination__link"
        to={nextPageUrl}
      >
        Next→
      </Link>
    )
  }

  let firstPage = ""

  if (currentPage - 1 > 1) {
    firstPage = (
      <Link className="home_pagination__link" to="/viewings/">
        1
      </Link>
    )
  }

  let prevDots = ""

  if (currentPage - 2 > 1) {
    prevDots = <span className="home_pagination__elipsis">…</span>
  }

  let prevPage = ""

  if (!isFirst) {
    prevPage = (
      <Link className="home_pagination__link" to={prevPageUrl}>
        {currentPage - 1}
      </Link>
    )
  }

  let nextPage = ""

  if (isLast) {
    nextPage = <span className="home_pagination__placeholder"></span>
  } else {
    nextPage = (
      <Link class="home_pagination__link" to={nextPageUrl}>
        {currentPage + 1}
      </Link>
    )
  }

  let nextDots = ""

  if (currentPage + 2 < numPages) {
    nextDots = <span class="home_pagination__elipsis">…</span>
  }

  let lastPage = ""

  if (currentPage + 1 < numPages) {
    lastPage = (
      <Link
        className="home_pagination__link"
        to={`/viewings/page-${numPages}/`}
      >
        {numPages}
      </Link>
    )
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
  )
}

function sortViewingDateAsc(a, b) {
  return sortStringAsc(a.date, b.date)
}

function sortViewingDateDesc(a, b) {
  return sortStringDesc(a.date, b.date)
}

function sortReleaseDateAsc(a, b) {
  return sortStringAsc(a.year, b.year)
}

function sortReleaseDateDesc(a, b) {
  return sortStringDesc(a.year, b.year)
}

function sortTitleAsc(a, b) {
  return collator.compare(a.title, b.title)
}

export const query = graphql`
  query {
    allReviewsJson {
      nodes {
        imdb_id
        slug
      }
    }
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
`

let reviews

export default function Viewings({ data, pageContext }) {
  const viewings = [...data.allViewingsJson.nodes]
  const inBrowser = typeof document !== "undefined"

  if (!reviews) {
    reviews = data.allReviewsJson.nodes
  }

  const sortMap = {
    "sort-viewing-date-desc": sortViewingDateDesc,
    "sort-viewing-date-asc": sortViewingDateAsc,
    "sort-release-date-desc": sortReleaseDateDesc,
    "sort-release-date-asc": sortReleaseDateAsc,
    title: sortTitleAsc,
  }

  let parsedQueryString

  if (inBrowser) {
    parsedQueryString = document.location.search
      ? queryString.parse(document.location.search)
      : {}
  }

  const [sortValue, setSortValue] = React.useState(
    parsedQueryString["order-by"]
  )

  console.log(document.location.search)
  console.log(sortValue)
  const [page, setPage] = React.useState([])

  const query = React.useRef({})

  React.useEffect(() => {
    console.log("effect")
    const comparer = sortMap[sortValue]

    const sortedViewings = viewings.sort(comparer)

    query.current["order-by"] = sortValue

    setPage(
      sortedViewings.slice(
        pageContext.skip,
        pageContext.skip + pageContext.limit
      )
    )
  }, [sortValue])

  const onOrderByChange = value => {
    setSortValue(value)
  }

  return (
    <Layout>
      <header class="viewings_header">
        <h2 class="viewings_heading">Viewing Log</h2>
        <p class="viewings_tagline">
          I&apos;ve watched {viewings.length} movies since 2012.
        </p>
      </header>

      <fieldset class="viewings__filters">
        <legend class="viewings__filters_header">Filter &amp; Sort</legend>
        <label class="viewings__label">
          Title
          <input type="text" placeholder="Enter all or part of a title" />
        </label>
        <label class="viewings__label">
          Release Year {releaseYearFilter(viewings)}
        </label>
        <label class="viewings__label">Venue {venueSelect(viewings)}</label>
        <label class="viewings__label">
          Order By
          <select
            onChange={e => onOrderByChange(e.target.value)}
            value={sortValue}
          >
            <option value="sort-viewing-date-dec">
              Viewing Date (Newest First)
            </option>
            <option value="sort-viewing-date-asc">
              Viewing Date (Oldest First)
            </option>
            <option value="sort-release-date-dec">
              Release Date (Newest First)
            </option>
            <option value="sort-release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="sort-release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="title">Title</option>
          </select>
        </label>
      </fieldset>
      <ol class="viewings-list">
        {page.map(viewing => {
          return (
            <li value={viewing.sequence} class="viewings_viewing">
              {titleForViewing(viewing)}
              {slugForViewing(viewing)}
            </li>
          )
        })}
      </ol>
      {buildPagination(pageContext, query.current)}
    </Layout>
  )
}
