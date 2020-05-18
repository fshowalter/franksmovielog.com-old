import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const TwoColumnWrap = styled.div`
  @media only screen and (min-width: ${breakpoints.mid}) {
    grid-template-columns: 38.2% 61.8%;
    width: 100%;
  }

  & > :nth-child(1) {
    @media only screen and (min-width: ${breakpoints.mid}) {
      float: left;
      width: 38.2%;
    }
  }

  & > :nth-child(2) {
    @media only screen and (min-width: ${breakpoints.mid}) {
      float: right;
      width: 61.8%;
    }
  }
`;

interface TwoColumnsProps {
  children: React.ReactNode;
}

export default function TwoColumns({ children }: TwoColumnsProps): JSX.Element {
  return <TwoColumnWrap>{children}</TwoColumnWrap>;
}
