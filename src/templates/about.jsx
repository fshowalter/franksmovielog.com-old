import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes from "prop-types";

import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

export default function HomeTemplate({ pageContext, data }) {
  return (
    <Layout>
      <main className="home">
        <div className="home-post_image_wrap">
          <Img fluid={data.heroImage.childImageSharp.fluid} alt="" />
        </div>
        <h1>About the Movielog</h1>
        <p>Meta posts about the site itself.</p>
        <ol className="home-post_list">
          {data.post.nodes.map((post, index) => {
            const listItemValue =
              data.post.nodes.length - pageContext.skip - index;
            return (
              <li className="home-post_list_item" value={listItemValue}>
                <div className="home-post_image_wrap">
                  <Img fluid={post.backdrop.childImageSharp.fluid} alt="" />
                </div>
                <h2 className="home-post_heading">{post.frontmatter.title}</h2>
                <div
                  className="home-post_excerpt"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: post.html,
                  }}
                />
                <Link
                  class="home-post_continue_reading"
                  to={post.frontmatter.slug}
                >
                  Continue Reading
                </Link>
              </li>
            );
          })}
        </ol>
        <Pagination
          currentPage={pageContext.currentPage}
          urlRoot="/"
          limit={pageContext.limit}
          numberOfItems={pageContext.numberOfItems}
        />
      </main>
    </Layout>
  );
}

HomeTemplate.propTypes = {
  pageContext: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    skip: PropTypes.number.isRequired,
    numberOfItems: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    heroImage: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({
          src: PropTypes.string.isRequired,
        }),
      }),
    }).isRequired,
    post: PropTypes.shape({
      nodes: PropTypes.arrayOf({
        frontmatter: PropTypes.shape({
          date: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          sequence: PropTypes.number.isRequired,
        }).isRequired,
        backdrop: PropTypes.shape({
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.shape({
              src: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
        html: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
};

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    heroImage: file(relativePath: { eq: "about.png" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        fluid(toFormat: JPG, jpegQuality: 85) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    post: allMarkdownRemark(
      filter: { postType: { eq: "post" } }
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        postType
        frontmatter {
          date(formatString: "DD MMM YYYY")
          slug
          title
          sequence
        }
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 85) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        html
      }
    }
  }
`;
