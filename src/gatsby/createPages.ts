import { GatsbyNode } from 'gatsby';

interface CreatePagesQuery {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          slug: string;
        };
      };
    }[];
  };
}

export const createPages: GatsbyNode["createPages"] = async function createPages({
  graphql,
  actions,
}) {
  const { createPage } = actions;
  await graphql(
    `
      query CreatePages {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/reviews/" } }
          sort: { fields: [frontmatter___sequence], order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    `
  ).then((result) => {
    const resultData = result.data as CreatePagesQuery;
    const reviewEdges = resultData.allMarkdownRemark.edges;

    // Create Review pages
    reviewEdges.forEach(({ node }) => {
      createPage({
        path: `/reviews/${node.frontmatter.slug}/`,
        component: require.resolve("../templates/Review.tsx"),
        context: {
          slug: node.frontmatter.slug,
          backdrop: `${node.frontmatter.slug}.png`,
        },
      });
    });

    // Create Home pages
    const reviewsPerPage = 20;
    const numPages = Math.ceil(reviewEdges.length / reviewsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/page-${i + 1}/`,
        component: require.resolve("../templates/Home.tsx"),
        context: {
          limit: reviewsPerPage,
          skip: i * reviewsPerPage,
          numPages,
          currentPage: i + 1,
          moreSkip: i * reviewsPerPage + reviewsPerPage,
          moreLimit: 4,
        },
      });
    });
  });
};
