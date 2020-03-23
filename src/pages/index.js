import React from "react";
import { graphql } from "gatsby";

export default ({ data }) => {
  return (
    <div>
      <h1>The Watchlist</h1>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Title</th>
            <th>Directors</th>
            <th>Performers</th>
            <th>Writers</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const query = graphql`
  query {
    allWatchlistTitle(sort: { fields: [year], order: ASC }) {
      edges {
        node {
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
