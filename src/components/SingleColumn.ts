import styled from "@emotion/styled";

const SingleColumn = styled.div`
  background: var(--color-content-background);
  margin: 0 auto;
  position: relative;
  width: 100%;

  @media only screen and (min-width: 50em) {
    max-width: 1000px;
  }
`;

export default SingleColumn;
