import { graphql } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes from "prop-types";

import Layout from "../components/Layout";

export default function HowIGradePage({ data }) {
  const post = data.post.nodes[0];

  return (
    <Layout>
      <main className="home">
        <div className="home-post_image_wrap">
          <Img fluid={post.backdrop.childImageSharp.fluid} alt="" />
        </div>
        <h1>About the Movielog</h1>
        <p>Meta posts about the site itself.</p>
        <article>
          <div
            className="home-post_excerpt"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: post.html,
            }}
          />
        </article>
      </main>
    </Layout>
  );
}

HowIGradePage.propTypes = {
  data: PropTypes.shape({
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
  query {
    post: allMarkdownRemark(
      filter: { frontmatter: { slug: { eq: "/how-i-grade/" } } }
      limit: 1
    ) {
      nodes {
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
