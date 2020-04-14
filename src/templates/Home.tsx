import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import parse from 'html-react-parser';
import React, { Fragment, memo } from 'react';
import { renderToString } from 'react-dom/server';
import remark from 'remark';

import styled from '@emotion/styled';

import Grade from '../components/Grade';
import Layout from '../components/Layout';
import MoreList from '../components/MoreList';
import SingleColumn from '../components/SingleColumn';

const remarkHTML = require("remark-html");

const HomeWrap = styled.div`
  padding: 20px;

  @media only screen and (min-width: 40.625em) {
    padding: 20px 110px;
  }
`;

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Review = styled.article`
  &:after {
    clear: both;
    content: "";
    display: table;
  }
`;

const ReviewDate = styled.div`
  color: var(--color-accent);
  display: block;
  font-family: var(--font-family-system);
  font-feature-settings: "tnum";
  font-size: 13px;
  font-weight: 400;
  line-height: 30px;
  margin: 0;
  text-transform: uppercase;
  width: 90px;
`;

const ReviewHeader = styled.header`
  margin: 0 0 10px;
`;

const ReviewHeading = styled.h3`
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  word-break: normal;
`;

const ReviewHeaderLink = styled(Link)`
  color: inherit;
`;

const ReviewImageWrap = styled(Link)`
  background-repeat: no-repeat;
  background-size: cover;
  border: 9px solid var(--color-primary);
  display: block;
  margin: 0 0 10px;
  position: relative;

  @media only screen and (min-width: 56.25em) {
    margin-bottom: 15px;
  }
`;

const ReviewExcerpt = styled.div`
  font-feature-settings: "ordn", "lnum";
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.16px;
  line-height: 28px;
  max-width: 700px;

  @media only screen and (min-width: 56.25em) {
    padding: 0 9px;
  }
`;

const ListItem = styled.li`
  margin: 0 0 25px;
  padding: 0;

  &:after {
    background-color: var(--color-primary);
    clear: both;
    content: "";
    display: block;
    height: 1px;
    margin: 40px 0 25px;
  }

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    @media only screen and (min-width: 56.25em) {
      ${ReviewHeader} {
        float: right;
        padding-left: 20px;
        width: 66%;
      }

      ${ReviewImageWrap} {
        float: left;
        margin: 0;
        width: 33%;
      }

      ${ReviewExcerpt} {
        float: right;
        padding-left: 20px;
        width: 66%;
      }
    }
  }
`;

interface Props {
  pageContext: {
    currentPage: number;
    numPages: number;
  };
  data: {
    reviews: {
      nodes: {
        fields: {
          backdrop?: {
            childImageSharp?: {
              fluid: FluidObject;
            };
          };
          movie: {
            title: string;
            year: number;
          };
          firstParagraph: string;
        };
        frontmatter: {
          title: string;
          sequence: number;
          date: string;
          grade: string;
          slug: string;
        };
      }[];
    };
    more: {
      nodes: {
        fields: {
          backdrop?: {
            childImageSharp?: {
              fluid: FluidObject;
            };
          };
          movie: {
            title: string;
          };
        };
        frontmatter: {
          grade: string;
          sequence: number;
          slug: string;
        };
      }[];
    };
  };
}

type ReviewNode = Props["data"]["reviews"]["nodes"][0];

const imageForNode = (node: ReviewNode) => {
  if (!node.fields.backdrop || !node.fields.backdrop.childImageSharp) {
    return null;
  }

  return (
    <Img
      fluid={node.fields?.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${node.frontmatter?.title}`}
    />
  );
};

const dateForNode = (node: ReviewNode) => {
  if (node.frontmatter === undefined || node.frontmatter.date == undefined) {
    return;
  }

  return node.frontmatter.date;
};

const StyledGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 3px;
  width: 95px;
`;

const buildExcerpt = (node: ReviewNode) => {
  let excerpt =
    renderToString(
      <StyledGrade grade={node.frontmatter.grade} width={95} height={95} />
    ) +
    " " +
    node.fields.firstParagraph;

  return parse(remark().use(remarkHTML).processSync(excerpt).toString());
};

interface PaginationProps {
  moreNodes: Props["data"]["more"]["nodes"];
  pageContext: Props["pageContext"];
}

const PaginationHeading = styled.div`
  border-bottom: 1px solid var(--color-primary);
  font-size: 16px;
  margin: 60px 0 10px;
  padding-bottom: 4px;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
`;

const PaginationWrap = styled.div`
  margin-bottom: 40px;
`;

const PaginationLinkWrap = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const PaginationNextPageLink = styled(Link)`
  border: 1px solid var(--color-primary);
  border-radius: 5px;
  color: var(--color-heading);
  display: inline-block;
  font-size: 15px;
  line-height: 38px;
  margin-top: 30px;
  padding: 0 60px 0 20px;
  position: relative;
  text-align: center;

  &:after {
    background-image: url('data:Image/svg+xml;charset=utf8,<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M6.165 3.874c-.217-.204-.22-.53-.008-.73.206-.192.56-.195.776.008l5.902 5.48c.11.102.165.236.165.37-.002.126-.055.262-.165.365l-5.902 5.478c-.217.204-.564.207-.776.007-.206-.193-.21-.525.008-.728L11.69 9 6.165 3.873z"></path></svg>');
    background-size: contain;
    content: "";
    height: 20px;
    opacity: 0.3;
    position: absolute;
    right: 20px;
    top: 9px;
    width: 20px;
  }
`;

const Pagination: React.FC<PaginationProps> = ({ moreNodes, pageContext }) => {
  const { currentPage, numPages } = pageContext;
  const isLast = currentPage === numPages;
  const nextPage = (currentPage + 1).toString();

  if (isLast) {
    return null;
  }

  return (
    <Fragment>
      <PaginationHeading>More from Frank's Movie Log</PaginationHeading>
      <MoreList nodes={moreNodes} />
      <PaginationWrap>
        <PaginationLinkWrap>
          <PaginationNextPageLink to={`/page-${nextPage}/`} rel="next">
            More reviews
          </PaginationNextPageLink>
        </PaginationLinkWrap>
      </PaginationWrap>
    </Fragment>
  );
};

const HomeTemplate: React.FC<Props> = ({ pageContext, data }) => {
  return (
    <Layout>
      <SingleColumn>
        <HomeWrap>
          <List>
            {data.reviews.nodes.map((node) => (
              <ListItem key={node.frontmatter?.sequence}>
                <Review>
                  <ReviewDate>{dateForNode(node)}</ReviewDate>
                  <ReviewHeader>
                    <ReviewHeading>
                      <ReviewHeaderLink
                        to={`/reviews/${node.frontmatter.slug}/`}
                      >
                        {node.fields.movie.title}
                      </ReviewHeaderLink>
                    </ReviewHeading>
                  </ReviewHeader>
                  <ReviewImageWrap to={`/reviews/${node.frontmatter.slug}/`}>
                    {imageForNode(node)}
                  </ReviewImageWrap>
                  <ReviewExcerpt>{buildExcerpt(node)}</ReviewExcerpt>
                </Review>
              </ListItem>
            ))}
          </List>
          <Pagination moreNodes={data.more.nodes} pageContext={pageContext} />
        </HomeWrap>
      </SingleColumn>
    </Layout>
  );
};

export default memo(HomeTemplate);

export const pageQuery = graphql`
  query IndexPosts(
    $skip: Int!
    $limit: Int!
    $moreSkip: Int!
    $moreLimit: Int!
  ) {
    reviews: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/reviews/" } }
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        fields {
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          movie {
            title
          }
          firstParagraph
        }
        frontmatter {
          title
          sequence
          date(formatString: "DD MMM YYYY")
          grade
          slug
        }
      }
    }
    more: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/reviews/" } }
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $moreLimit
      skip: $moreSkip
    ) {
      nodes {
        fields {
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          movie {
            title
          }
        }
        frontmatter {
          sequence
          grade
          slug
        }
      }
    }
  }
`;
