import { graphql, Link, StaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import React from "react";

import styled from "@emotion/styled";

import Grade from "./Grade";

const RecentPostsListItem = styled.li``;

const RecentPostsYear = styled.span``;

const RecentPostsLink = styled(Link)``;

const RecentPostsGrade = styled(Grade)``;

interface RecentPost {
  grade: string;
  sequence: number;
  slug: string;
  movie: {
    title: string;
    year: string;
  };
  markdown: {
    backdrop?: {
      childImageSharp?: {
        fluid: FluidObject;
      };
    };
  };
}

export default function RecentPosts(): JSX.Element {
  return (
    <StaticQuery
      query={graphql`
        query RecentPostsQuery {
          allReview(sort: { fields: [sequence], order: DESC }, limit: 5) {
            nodes {
              grade
              slug
              sequence
              markdown {
                backdrop {
                  childImageSharp {
                    fluid(toFormat: JPG, jpegQuality: 75, maxWidth: 684) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
              movie {
                title
                year
              }
            }
          }
        }
      `}
      render={(data): JSX.Element => (
        <>
          {data.allReview.nodes.map((node: RecentPost) => (
            <RecentPostsListItem key={node.sequence}>
              <RecentPostsLink to={`/reviews/${node.slug}/`}>
                {node.movie.title}{" "}
                <RecentPostsYear>{node.movie.year}</RecentPostsYear>{" "}
                <RecentPostsGrade grade={node.grade} />
              </RecentPostsLink>
            </RecentPostsListItem>
          ))}
        </>
      )}
    />
  );
}
