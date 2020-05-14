import React from "react";

import styled from "@emotion/styled";

const ColumnWrap = styled.div`
  @media only screen and (min-width: 48em) {
    border-top: solid 1px #eee;
    display: flex;
    margin: 0 auto;
    width: 700px;
  }
  @media only screen and (min-width: 71.24em) {
    width: 900px;
  }
`;

export const Column1 = styled.div`
  @media only screen and (min-width: 48em) {
    width: 250px;
  }

  @media only screen and (min-width: 71.24em) {
    width: 340px;
  }
`;

export const Column2 = styled.div`
  @media only screen and (min-width: 48em) {
    padding-left: 30px;
    width: 420px;
  }

  @media only screen and (min-width: 71.24em) {
    width: 540px;
  }
`;

interface TwoColumnsProps {
  children: React.ReactNode;
}

export default function TwoColumns({ children }: TwoColumnsProps): JSX.Element {
  return <ColumnWrap>{children}</ColumnWrap>;
}
