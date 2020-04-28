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
  location: {
    pathname: string;
  };
  pageContext: {
    currentPage: number;
    numPages: number;
  };
  data: {
    page: {
      nodes: {
        sequence: number;
        date: string;
        grade: string;
        slug: string;
        movie: {
          title: string;
          year: number;
        };
        markdown: {
          backdrop?: {
            childImageSharp?: {
              fluid: FluidObject;
            };
          };
          firstParagraph: string;
        };
      }[];
    };
    more: {
      nodes: {
        grade: string;
        sequence: number;
        slug: string;
        movie: {
          title: string;
        };
        markdown: {
          backdrop?: {
            childImageSharp?: {
              fluid: FluidObject;
            };
          };
        };
      }[];
    };
  };
}

type ReviewNode = Props["data"]["page"]["nodes"][0];

const imageForNode = (node: ReviewNode) => {
  if (!node.markdown.backdrop || !node.markdown.backdrop.childImageSharp) {
    return null;
  }

  return (
    <Img
      fluid={node.markdown.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${node.movie.title}`}
    />
  );
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
  const excerpt =
    `${renderToString(<StyledGrade grade={node.grade} width={95} height={95} />) 
    } ${ 
      node.markdown.firstParagraph}`;

  return parse(remark().use(remarkHTML).processSync(excerpt).toString());
};

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

interface PaginationProps {
  moreNodes: Props["data"]["more"]["nodes"];
  pageContext: Props["pageContext"];
}

const Pagination: React.FC<PaginationProps> = ({ moreNodes, pageContext }) => {
  const { currentPage, numPages } = pageContext;
  const isLast = currentPage === numPages;
  const nextPage = (currentPage + 1).toString();

  if (isLast) {
    return null;
  }

  return (
    <>
      <PaginationHeading>More from Frank's Movie Log</PaginationHeading>
      <MoreList nodes={moreNodes} />
      <PaginationWrap>
        <PaginationLinkWrap>
          <PaginationNextPageLink to={`/page-${nextPage}/`} rel="next">
            More reviews
          </PaginationNextPageLink>
        </PaginationLinkWrap>
      </PaginationWrap>
    </>
  );
};

const HomeTemplate: React.FC<Props> = ({ location, pageContext, data }) => {
  return (
    <Layout location={location}>
      <SingleColumn>
        <HomeWrap>
          <List>
            {data.page.nodes.map((node) => (
              <ListItem key={node.sequence}>
                <Review>
                  <ReviewDate>{node.date}</ReviewDate>
                  <ReviewHeader>
                    <ReviewHeading>
                      <ReviewHeaderLink to={`/reviews/${node.slug}/`}>
                        {node.movie.title}
                      </ReviewHeaderLink>
                    </ReviewHeading>
                  </ReviewHeader>
                  <ReviewImageWrap to={`/reviews/${node.slug}/`}>
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
  query($skip: Int!, $limit: Int!, $moreSkip: Int!, $moreLimit: Int!) {
    page: allReview(
      sort: { fields: [sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        date(formatString: "DD MMM YYYY")
        grade
        slug
        sequence
        movie {
          title
        }
        markdown {
          firstParagraph
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    more: allReview(
      sort: { fields: [sequence], order: DESC }
      limit: $moreLimit
      skip: $moreSkip
    ) {
      nodes {
        grade
        slug
        sequence
        markdown {
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        movie {
          title
        }
      }
    }
  }
`;
