/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path");
// const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allReviewsJson(sort: { fields: [sequence], order: DESC }) {
          nodes {
            sequence
            slug
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create Review pages
  result.data.allReviewsJson.nodes.forEach((node) => {
    createPage({
      path: `/reviews/${node.slug}/`,
      component: path.resolve("./src/templates/review.jsx"),
      context: {
        slug: node.slug,
        backdrop: `${node.slug}.png`,
      },
    });
  });

  // Create home pages
  const reviews = result.data.allReviewsJson.nodes;
  const reviewsPerPage = 20;
  const numPages = Math.ceil(reviews.length / reviewsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/page-${i + 1}/`,
      component: path.resolve("./src/templates/home.jsx"),
      context: {
        limit: reviewsPerPage,
        skip: i * reviewsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    schema.buildObjectType({
      name: "ReviewJson",
      fields: {
        backdrop: {
          type: "File",
          resolve: (source, args, context) => {
            if (!source || !source.slug) {
              return null;
            }

            const backdropPath = path(
              `./src/assets/backdrops/${source.slug}.png`
            );

            if (!backdropPath) {
              return null;
            }

            return context.nodeModel
              .getAllNodes({ type: "File" })
              .find((node) => node.absolutePath === backdropPath);
          },
        },
      },
    }),
  ];

  createTypes(typeDefs);
};
