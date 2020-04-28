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

const slugForNode = (node: Props["data"]["allViewing"]["nodes"][0]): string => {
  return `${moment(node.date).format("dddd, MMMM Do YYYY")} via ${node.venue}.`;
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
    allViewing: {
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

export default function Viewings({ data, location }: Props): JSX.Element {
  return (
    <TwoColumnLayout location={location}>
      <Column1>
        <PanelHeading
          title="Viewing Log"
          slug={`I've watched ${data.allViewing.nodes.length} movies since 2012`}
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
        <List id="viewings">
          {data.allViewing.nodes.map(
            (node: Props["data"]["allViewing"]["nodes"][0]) => (
              <ListItem
                key={node.sequence}
                title={`${node.movie.title}`}
                slug={slugForNode(node)}
              />
            )
          )}
        </List>
      </Column2>
    </TwoColumnLayout>
  );
}

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
