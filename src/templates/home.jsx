import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import marked from "marked";
import React from "react";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

export default function HomeTemplate({ pageContext, data }) {
  return (
    <Layout>
      <main class="home">
        <ol class="home_post_list">
          $
          {pagination.items
            .map((review) => {
              return this.html`<li class="home_post_list_item" value=${
                review.sequence
              }>
              <h2 class="home_post_heading">${this.titleWithYear(review)}</h2>
              <div class="home_post_image_wrap">
                <img class="home_post_image" src="${`/backdrops/${review.slug}.png`}" alt="${`A still from ${review.title} (${review.year})`}" />
              </div>
              ${imageForGrade(review.grade, "home_review_grade")}
              ${this.markdown(firstParagraph(review.review_content)).replace(
                "<p>",
                '<p class="home_post_excerpt">'
              )}
              <a class="home_post__continue_reading" href="/reviews/${
                review.slug
              }/">Continue Reading</a>
            </li>`;
            })
            .join("\n")}
        </ol>
        <Pagination />
      </main>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!, $moreSkip: Int!, $moreLimit: Int!) {
    page: allReviewJson(
      sort: { fields: [sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        date(formatString: "DD MMM YYYY")
        grade
        slug
        sequence
        title
        year
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 75) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        review_content
      }
    }
  }
`;
