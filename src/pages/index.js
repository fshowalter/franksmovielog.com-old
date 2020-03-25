import React from "react";
import { graphql } from "gatsby";
import { css } from "@emotion/core";
import LayoutSingle from "../components/LayoutSingle";

const containerStyles = css({
  background: "#fff",
  margin: "0 auto",
  position: "relative",
  width: "100%",
  "@media only screen and (min-width: 50em)": {
    maxWidth: "1000px"
  }
});

let viewings = {};

const viewed = ({ node, viewing_data }) => {
  if (!(node.imdb_id in viewings)) {
    viewings = viewing_data.reduce(function(map, obj) {
      if (!(obj.node.imdb_id in map)) {
        map[obj.node.imdb_id] = [];
      }

      map[obj.node.imdb_id].push(obj.node);
      return map;
    }, {});
  }

  return viewings[node.movie_imdb_id] || [];
};

export default ({ data }) => {
  return (
    <LayoutSingle>
      <h1>The Watchlist</h1>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Title</th>
            <th>Directors</th>
            <th>Performers</th>
            <th>Writers</th>
            <th>Viewed</th>
          </tr>
        </thead>
        <tbody>
          {data.allWatchlistTitle.edges.map(({ node }, index) => (
            <tr key={index}>
              <td>{node.year}</td>
              <td>{node.title}</td>
              <td>{node.director_names}</td>
              <td>{node.performer_names}</td>
              <td>{node.writer_names}</td>
              <td>
                {viewed({
                  node: node,
                  viewing_data: data.allViewingsYaml.edges
                }).map((viewing, viewing_index) => (
                  <div style={{ whiteSpace: "nowrap" }} key={viewing_index}>
                    {viewing.date}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutSingle>
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
        }
      }
    }
  }
`;
