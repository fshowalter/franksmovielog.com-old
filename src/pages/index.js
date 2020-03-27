import React, { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";
import Layout from "../components/Layout";
import { TwoColumns, Column1, Column2 } from "../components/TwoColumns";
import { List, ListItem } from "../components/ListWithSlug";
import PanelHeading from "../components/PanelHeading";
import pluralize from "pluralize";
import {
  FilterPanel,
  SelectFilter,
  TextFilter
} from "../components/FilterPanel";
import { useDebouncedCallback } from "use-debounce";
import { timedChunk, buildMatcher, escapeRegExp } from "../utils/filtering";

const formatPeople = (people, suffix) => {
  if (!people) {
    return "";
  }

  let splitNames = people.split("|");
  let names = new Intl.ListFormat("en").format(splitNames);

  return `${names} ${suffix}`;
};

const formatCollections = collections => {
  if (!collections) {
    return "";
  }
  let splitCollections = collections.split(",");
  let names = new Intl.ListFormat("en").format(splitCollections);
  return `it's a ${names} film`;
};

const slugForNode = node => {
  let credits = [
    formatPeople(node.director_names, "directed"),
    formatPeople(node.performer_names, "performed"),
    formatPeople(node.writer_names, "wrote it"),
    formatCollections(node.collection_names)
  ];

  let slug = `Because `;

  do {
    let credit = credits.shift();

    if (!credit) {
      continue;
    }

    slug += credit;
    if (credits.find(item => item.length > 0)) {
      slug += " and ";
    }
  } while (credits.length > 0);

  return `${slug}.`;
};

let viewings = {};
let items = null;

const viewingsForNode = (node, viewing_data) => {
  if (!(node.imdb_id in viewings)) {
    viewings = viewing_data.reduce(function(map, obj) {
      if (!(obj.node.imdb_id in map)) {
        map[obj.node.imdb_id] = [];
      }

      map[obj.node.imdb_id].push(obj.node);
      return map;
    }, {});
  }

  let viewingsForNode = viewings[node.movie_imdb_id] || [];
  let viewingCount = viewingsForNode.length;

  if (viewingCount == 0) {
    return "";
  }
  return `Seen ${pluralize("time", viewingCount, true)}.`;
};

export default ({ data }) => {
  const [onTitleChange] = useDebouncedCallback(
    value => {
      let regex = new RegExp(escapeRegExp(value), "i");

      const matcher = buildMatcher(item => {
        return regex.test(item.getAttribute("data-title"));
      });

      timedChunk(items, matcher);
    },
    // delay in ms
    50
  );

  useEffect(() => {
    items = document.querySelectorAll("#watchlist li");

    // Specify how to clean up after this effect:
    return function cleanup() {
      items = null;
    };
  });

  return (
    <Layout>
      <TwoColumns>
        <Column1>
          <PanelHeading
            title="My Watchlist"
            slug="My movie bucket list. No silents or documentaries"
          />
          <FilterPanel heading="Filter and Sort">
            <TextFilter
              type="title"
              name="Title"
              onChange={e => onTitleChange(e.target.value)}
              placeholder="Enter all or part of a title."
            />
            <SelectFilter name="Order By">
              {[
                ["Date (Oldest First)", "date-asc"],
                ["Date (Newest First)", "date-desc"],
                ["Title", "title-asc"]
              ]}
            </SelectFilter>
          </FilterPanel>
        </Column1>
        <Column2>
          <List id="watchlist">
            {data.allWatchlistTitle.edges.map(({ node }) => (
              <ListItem
                key={node.movie_imdb_id}
                title={`${node.title} (${node.year})`}
                slug={slugForNode(node)}
                tag={viewingsForNode(node, data.allViewingsYaml.edges)}
              ></ListItem>
            ))}
          </List>
        </Column2>
      </TwoColumns>
    </Layout>
  );
};

export const query = graphql`
  query {
    allViewingsYaml(sort: { fields: [sequence], order: ASC }) {
      edges {
        node {
          sequence
          date(formatString: "YYYY-MM-DD")
          imdb_id
          venue
        }
      }
    }
    allWatchlistTitle(sort: { fields: [year], order: ASC }) {
      edges {
        node {
          movie_imdb_id
          title
          year
          director_names
          performer_names
          writer_names
          collection_names
        }
      }
    }
  }
`;
