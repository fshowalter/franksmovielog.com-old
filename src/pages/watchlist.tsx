import { graphql } from 'gatsby';
import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import styled from '@emotion/styled';
import { WindowLocation } from '@reach/router';

import { Column1, Column2, TwoColumns } from '../components/TwoColumnLayout';

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
    formatPeople(watchlistTitle.writers, "wrote some or all of it"),
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

const Container = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  margin: 20px;
  transition: opacity 0.3s ease;
`;

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
  border-bottom: solid 1px $filter_border_color;
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
  name: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const TextFilter = ({ name, placeholder, onChange }: TextFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <TextInputWrap>
        <TextInput onChange={onChange} name={name} placeholder={placeholder} />
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
    <Container>
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </Container>
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

const escapeRegExp = (str: string): string => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

const Watchlist: React.FC<Props> = ({ location, data }) => {
  const [items, setItems] = useState(
    data.allWatchlistTitle.nodes.map((watchlistTitle) => {
      return { filtered: false, ...watchlistTitle };
    })
  );

  const [onTitleChange] = useDebouncedCallback(
    (value: string) => {
      const regex = new RegExp(escapeRegExp(value), "i");
      const newItems = items.map((watchlistTitle) => {
        return {
          ...watchlistTitle,
          filtered: !regex.test(watchlistTitle.movie.title),
        };
      });

      console.log(newItems);

      setItems(newItems);
    },
    // delay in ms
    100
  );

  return (
    <TwoColumns location={location}>
      <Column1>
        <PanelHead
          title={"The Watchlist"}
          slug={"My movie review bucketlist. No silents or documentaries."}
        />
        <FilterPanel heading="Filter and Sort">
          <TextFilter
            name="Title"
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter all or part of a title."
          />
          <SelectFilter name="Order By">
            {[
              ["Date (Oldest First)", "date-asc"],
              ["Date (Newest First)", "date-desc"],
              ["Title", "title-asc"],
            ]}
          </SelectFilter>
        </FilterPanel>
      </Column1>
      <Column2>
        <List>
          {items.map((watchlistTitle) => (
            <ListItem
              key={watchlistTitle.imdbId}
              style={watchlistTitle.filtered ? { display: "none" } : undefined}
            >
              {watchlistTitle.filtered}
              <Title>
                {watchlistTitle.movie.title} ({watchlistTitle.movie.year})
              </Title>
              <Slug>{buildSlug(watchlistTitle)}</Slug>
            </ListItem>
          ))}
        </List>
      </Column2>
    </TwoColumns>
  );
};

export default Watchlist;

export const query = graphql`
  query {
    allWatchlistTitle(sort: { fields: [movie___year], order: ASC }) {
      nodes {
        imdbId
        movie {
          title
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