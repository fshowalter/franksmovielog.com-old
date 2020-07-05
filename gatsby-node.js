/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allViewingsJson(sort: { fields: [sequence], order: DESC }) {
          nodes {
            sequence
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // ...

  // Create viewing log pages
  const viewings = result.data.allViewingsJson.nodes;
  const viewingsPerPage = 50;
  const numPages = Math.ceil(viewings.length / viewingsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/viewings` : `/viewings/page-${i + 1}`,
      component: path.resolve("./src/templates/viewings.jsx"),
      context: {
        limit: viewingsPerPage,
        skip: i * viewingsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};
