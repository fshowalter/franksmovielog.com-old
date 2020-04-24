import { graphql, useStaticQuery } from 'gatsby';
import moment from 'moment';
import pluralize from 'pluralize';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import styled from '@emotion/styled';

import { FilterPanel, SelectFilter, TextFilter } from '../components/FilterPanel';
import Layout from '../components/Layout';
import { List, ListItem } from '../components/ListWithSlug';
import PanelHeading from '../components/PanelHeading';
import { Column1, Column2, TwoColumns } from '../components/TwoColumnLayout';
import { buildMatcher, escapeRegExp, timedChunk } from '../utils/filtering-old';

const slugForNode = (node) => {
  return `${moment(node.date).format("dddd, MMMM Do YYYY")} via ${node.venue}.`;
};

let items;

export default ({ data, location }) => {
  const [onTitleChange] = useDebouncedCallback(
    (value) => {
      let regex = new RegExp(escapeRegExp(value), "i");

      const matcher = buildMatcher((item) => {
        return regex.test(item.getAttribute("data-title"));
      });

      timedChunk(items, matcher);
    },
    // delay in ms
    50
  );

  useEffect(() => {
    items = document.querySelectorAll("#viewings li");

    // Specify how to clean up after this effect:
    return function cleanup() {
      items = null;
    };
  });

  return (
    <Layout location={location}>
      <TwoColumns>
        <Column1>
          <PanelHeading
            title="Viewing Log"
            slug={`I've watched ${data.allViewingsYaml.edges.length} movies since 2012`}
          />
          <FilterPanel heading="Filter and Sort">
            <TextFilter
              type="title"
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
          <List id="viewings">
            {data.allViewingsYaml.edges.map(({ node }) => (
              <ListItem
                key={node.sequence}
                title={`${node.title}`}
                slug={slugForNode(node)}
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
    allViewing(sort: { fields: [sequence], order: DESC }) {
      nodes {
        sequence
        date(formatString: "YYYY-MM-DD")
        imdbId
        venue
        movie {
          title
          year
        }
      }
    }
  }
`;
