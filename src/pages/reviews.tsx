import { graphql } from "gatsby";
import moment from "moment";
import React from "react";

import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import { FilterPanel, TextFilter } from "../components/FilterPanel";
import { List, ListItem } from "../components/ListWithSlug";
import PanelHeading from "../components/PanelHeading";
import {
  Column1,
  Column2,
  TwoColumnLayout,
} from "../components/TwoColumnLayout";

const slugForReview = (
  review: Props["data"]["reviews"]["nodes"][0]
): string => {
  return `${moment(review.date).format("dddd, MMMM Do YYYY")} via ${
    review.venue
  }.`;
};

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
  background-color: #fff;
  color: var(--color-text-secondary);
  font-size: 15px;
  text-indent: 0.01px;
  text-overflow: "";
`;

interface SelectFilterProps {
  name: string;
  children: Array<[string, string]>;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  name,
  children,
}: SelectFilterProps) => {
  return (
    <FilterControl>
      <Label htmlFor={name}>{name}</Label>
      <SelectInput>
        {children.map(([optionName, optionValue]) => {
          return (
            <option key={optionValue} value={optionValue}>
              {optionName}
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
    reviews: {
      nodes: {
        sequence: number;
        date: string;
        imdbId: string;
        venue: string;
        movie: {
          title: string;
          year: string;
        };
      }[];
    };
  };
}

const Reviews: React.FC<Props> = ({ location, data }: Props) => {
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
          year
        }
      }
    }
  }
`;
