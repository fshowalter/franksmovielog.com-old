import { graphql } from 'gatsby';
import pluralize from 'pluralize';
import React, { ReactNode } from 'react';

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { WindowLocation } from '@reach/router';

import { Column1, Column2, TwoColumnLayout } from '../components/TwoColumnLayout';

const PanelHeader = styled.header`
  padding: 35px 20px 20px;
  text-align: center;

  @media only screen and (min-width: 50em) {
    margin: 20px;
    padding: 20px;
    text-align: left;
  }
`;

const PanelHeading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const PanelSlug = styled.div`
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 0;
`;

interface PanelHeaderProps {
  title: string;
  slug: string;
}

const PanelHead = React.memo(({ title, slug }: PanelHeaderProps) => {
  return (
    <PanelHeader>
      <PanelHeading>{title}</PanelHeading>
      <PanelSlug>{slug}</PanelSlug>
    </PanelHeader>
  );
});

const List = styled.ol`
  margin: 0 0 35px;
  padding: 0;

  @media only screen and (min-width: 50em) {
    margin-top: 24px;
  }
`;

const ListItem = React.memo(styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: var(--color-primary);
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 20px;
    margin: 0;
    position: absolute;
    right: 0;
  }
`);

const Title = styled.div`
  display: block;
  font-size: 18px;
  line-height: 40px;
  overflow: hidden;
  padding: 20px 20px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Slug = styled.div`
  color: var(--color-text-hint);
  font-size: 15px;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;
`;

interface WatchlistPerson {
  fullName: string;
}

interface WatchlistPersons extends Array<WatchlistPerson> {}

const formatPeople = (people: WatchlistPersons, suffix: string) => {
  if (people.length === 0) {
    return "";
  }
  const names = people.map((person) => person.fullName);

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `${formattedNames} ${suffix}`;
};

interface WatchlistCollection {
  name: string;
}

interface Collections extends Array<WatchlistCollection> {}

const formatCollections = (collections: Collections) => {
  if (collections.length === 0) {
    return "";
  }

  const names = collections.map((collection) => collection.name);

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `it's a ${formattedNames} film`;
};

const buildSlug = (
  watchlistTitle: Props["data"]["allWatchlistTitle"]["nodes"][0]
) => {
  let credits = [
    formatPeople(watchlistTitle.directors, "directed"),
    formatPeople(watchlistTitle.performers, "performed"),
    formatPeople(watchlistTitle.writers, "has a writing credit"),
    formatCollections(watchlistTitle.collections),
  ];

  let slug = `Because `;

  do {
    let credit = credits.shift();

    if (!credit) {
      continue;
    }

    slug += credit;
    if (credits.find((item) => item.length > 0)) {
      slug += " and ";
    }
  } while (credits.length > 0);

  return `${slug}.`;
};

const styleVars = {
  filterBackgroundColor: "#fff",
  filterBorderColor: "var(--color-primary)",
  filterSliderActiveHandleBackgroundColor: "#eaeaea",
  filterSliderBackgroundColor: "rgba(0, 0, 0, .02)",
  filterTextBoxColor: "var(--color-text-secondary)",
};

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-primary);
  color: var(--color-accent);
  display: block;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 20px;
  padding: 20px;
  position: relative;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 0 20px;
`;

const TextInput = styled.input`
  outline: none;
  backface-visibility: hidden;
  background-color: ${styleVars.filterBackgroundColor};
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: ${styleVars.filterTextBoxColor};
  display: block;
  font-family: var(--font-family-system);
  font-size: 16px;
  padding: 0;
  width: 100%;
  ::placeholder {
    color: var(--color-text-hint);
    font-family: var(--font-family-system);
    font-size: 14px;
    font-weight: normal;
  }
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  margin-bottom: 8px;
  padding-bottom: 7px;
`;

const FilterControl = styled.div`
  margin-bottom: 35px;
`;

const Label = styled.label`
  color: var(--color-accent);
  display: block;
  font-size: 15px;
  font-weight: normal;
  line-height: 2.2;
`;

const SelectInput = styled.select`
  appearance: none;
  backface-visibility: hidden;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  display: block;
  font-family: var(--font-family-system);
  padding: 0;
  width: 100%;
  background-color: ${styleVars.filterBackgroundColor};
  color: ${styleVars.filterTextBoxColor};
  font-size: 15px;
  text-indent: 0.01px;
  text-overflow: "";
`;

const FiltersWrap = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  margin: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .js-filters & {
    opacity: 1;
  }
`;

const RangeFilterWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  .noUi-target * {
    background-color: rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
    cursor: default;
    touch-action: none;
    -webkit-touch-callout: none;
    transition: transform 0.3s ease-in-out;
    user-select: none;
  }

  .noUi-state-drag .noUi-active {
    transform: scale(1.25);
  }

  .noUi-base {
    background: rgba(0, 0, 0, 0.02);
    border-bottom: solid 0.5rem #fff;
    border-top: solid 0.5rem #fff;
    height: 2rem;
    margin: auto 0.8rem;
    position: relative;

    @media only screen and (min-width: 35em) {
      border-color: #fff;
    }
  }

  .noUi-handle {
    background-color: #fff;
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    height: 2rem;
    left: -1rem;
    position: relative;
    top: -0.5rem;
    width: 2rem;
    z-index: 1;
  }

  .noUi-active {
    background-color: #eaeaea;
    box-shadow: inset 0 0 5px var(--color-primary);
  }

  .noUiSlider {
    flex: 1 100%;
  }

  .noUi-origin {
    border-radius: inherit;
    bottom: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .noUi-stacking .noUi-handle {
    z-index: 10;
  }
`;

const rangeInputMixin = css`
  -moz-appearance: textfield;
  background-color: #fff;
  border: 0;
  box-sizing: content-box;
  color: var(--color-text-secondary);
  font-family: var(--font-family-system);
  font-size: 14px;
  line-height: 1.2rem;
  padding: 0;
  width: 25%;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  width: 3rem;

  @media (min-width: 50em) {
    height: 1.4rem;
    line-height: 1.4rem;
  }
`;

const RangeInputMin = styled.input`
  ${rangeInputMixin}
  margin-right: auto;
`;

const RangeInputMax = styled.input`
  ${rangeInputMixin}
  align-self: flex-start;
  text-align: right;
`;

interface RangeFilterProps {
  name: string;
  attribute: string;
  min: string;
  max: string;
}

const RangeFilter = ({ name, attribute, min, max }: RangeFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <RangeFilterWrap
        data-filter-attribute={attribute}
        data-filter-type="range"
        data-filter-min-value={min}
        data-filter-max-value={max}
      >
        <div className="noUiSlider noUi-target">
          <div className="noUi-base noUi-background noUi-horizontal">
            <div
              className="noUi-origin noUi-origin-lower"
              style={{ left: "0%" }}
            >
              <div className="noUi-handle noUi-handle-lower" />
            </div>
            <div
              className="noUi-origin noUi-origin-upper"
              style={{ left: "100%" }}
            >
              <div className="noUi-handle noUi-handle-upper" />
            </div>
          </div>
        </div>
        <RangeInputMin
          type="number"
          defaultValue={min}
          min={min}
          max={max}
          step="1"
          className="filter-numeric min"
        />
        <RangeInputMax
          type="number"
          defaultValue={max}
          min={min}
          max={max}
          step="1"
          className="filter-numeric max"
        />
      </RangeFilterWrap>
    </FilterControl>
  );
};

interface SelectFilterProps {
  name: string;
  children: Array<[string, string]>;
}

const SelectFilter = ({ name, children }: SelectFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <SelectInput>
        {children.map(([name, value]) => {
          return (
            <option key={value} value={value}>
              {name}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
};

interface TextFilterProps {
  label: string;
  placeholder: string;
  filterAttribute: string;
}

const TextFilter = ({
  label,
  placeholder,
  filterAttribute,
}: TextFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={label}>{label}</Label>
      <TextInputWrap>
        <TextInput
          name={label}
          placeholder={placeholder}
          data-filter-type="text"
          data-filter-attribute={filterAttribute}
        />
      </TextInputWrap>
    </FilterControl>
  );
};

interface FilterPanelProps {
  heading: string;
  children: ReactNode;
}

const FilterPanel = ({ heading, children }: FilterPanelProps) => {
  return (
    <FiltersWrap data-filter-controls={true} data-target={"#watchlist-titles"}>
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </FiltersWrap>
  );
};

interface SorterProps {
  name: string;
  children: Array<[string, string]>;
  target: string;
}

const Sorter = ({ name, children, target }: SorterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <SelectInput
        name={name}
        data-sorter={children[0][1]}
        data-target={target}
      >
        {children.map(([name, value]) => {
          return (
            <option key={value} value={value}>
              {name}
            </option>
          );
        })}
      </SelectInput>
    </FilterControl>
  );
};

interface Props {
  location: WindowLocation;
  data: {
    allWatchlistTitle: {
      nodes: {
        imdbId: string;
        movie: {
          title: string;
          sortTitle: string;
          year: string;
        };
        directors: {
          fullName: string;
        }[];
        performers: {
          fullName: string;
        }[];
        writers: {
          fullName: string;
        }[];
        collections: {
          name: string;
        }[];
      }[];
    };
  };
}

const Watchlist: React.FC<Props> = ({ location, data }) => {
  const releaseYears = data.allWatchlistTitle.nodes
    .map((node) => {
      return node.movie.year;
    })
    .sort();

  const minYear = releaseYears[0];
  const maxYear = releaseYears[releaseYears.length - 1];

  return (
    <TwoColumnLayout location={location}>
      <Column1>
        <PanelHead
          title={"The Watchlist"}
          slug={`My movie review bucketlist. ${Number(
            data.allWatchlistTitle.nodes.length
          ).toLocaleString()} ${pluralize(
            "title",
            data.allWatchlistTitle.nodes.length
          )}. No silents or documentaries.`}
        />
        <FilterPanel heading="Filter and Sort">
          <TextFilter
            label="Title"
            placeholder="Enter all or part of a title."
            filterAttribute="data-title"
          />
          <RangeFilter
            name="Release Year"
            attribute="data-year"
            min={minYear}
            max={maxYear}
          />
          <Sorter name="Order By" target="#watchlist-titles">
            {[
              ["Year (Oldest First)", "year-asc"],
              ["Year (Newest First)", "year-desc"],
              ["Title", "sort-title-asc"],
            ]}
          </Sorter>
        </FilterPanel>
      </Column1>
      <Column2>
        <List id="watchlist-titles">
          {data.allWatchlistTitle.nodes.map((watchlistTitle) => (
            <ListItem
              key={watchlistTitle.imdbId}
              data-title={watchlistTitle.movie.title}
              data-sort-title={watchlistTitle.movie.sortTitle}
              data-year={watchlistTitle.movie.year}
            >
              <Title>
                {watchlistTitle.movie.title} ({watchlistTitle.movie.year})
              </Title>
              <Slug>{buildSlug(watchlistTitle)}</Slug>
            </ListItem>
          ))}
        </List>
      </Column2>
    </TwoColumnLayout>
  );
};

export default React.memo(Watchlist);

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
