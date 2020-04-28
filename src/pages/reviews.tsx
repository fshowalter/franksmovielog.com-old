import { graphql, useStaticQuery } from 'gatsby';
import moment from 'moment';
import pluralize from 'pluralize';
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { WindowLocation } from '@reach/router';

import { FilterPanel, SelectFilter, TextFilter } from '../components/FilterPanel';
import Layout from '../components/Layout';
import { List, ListItem } from '../components/ListWithSlug';
import PanelHeading from '../components/PanelHeading';
import { Column1, Column2, TwoColumnLayout } from '../components/TwoColumnLayout';
import { buildMatcher, escapeRegExp, timedChunk } from '../utils/filtering-old';

const slugForReview = (review: Props["data"]["reviews"]["nodes"][0]) => {
  return `${moment(review.date).format("dddd, MMMM Do YYYY")} via ${
    review.venue
  }.`;
};

let items: NodeListOf<HTMLElement> | null = null;

interface Props {
  location: WindowLocation;
  data: {
    reviews: {
      nodes: {
        sequence: number;
        date: string;
        imdbId: string;
        venue: string;
        movie: {
          title: string;
        };
      }[];
    };
  };
}

const Reviews: React.FC<Props> = ({ location, data }) => {
  useEffect(() => {
    items = document.querySelectorAll<HTMLLIElement>("#reviews li");

    // Specify how to clean up after this effect:
    return function cleanup() {
      items = null;
    };
  });

  return (
    <TwoColumnLayout location={location}>
      <Column1>
        <PanelHeading
          title="Reviews"
          slug={`I've published ${data.reviews.nodes.length} movies since 2014`}
        />
        <FilterPanel heading="Filter and Sort">
          <TextFilter
            name="Title"
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
        <List id="reviews">
          {data.reviews.nodes.map((review) => (
            <ListItem
              key={review.sequence}
              title={`${review.movie.title}`}
              slug={slugForReview(review)}
            />
          ))}
        </List>
      </Column2>
    </TwoColumnLayout>
  );
};

export default Reviews;

export const pageQuery = graphql`
  query {
    reviews: allReview(sort: { fields: [movie___sortTitle], order: ASC }) {
      nodes {
        imdbId
        sequence
        grade
        date(formatString: "YYYY-MM-DD")
        movie {
          title
        }
      }
    }
  }
`;
