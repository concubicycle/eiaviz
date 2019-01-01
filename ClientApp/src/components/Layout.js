import React from 'react';
import NavBar from './NavBar'

import styled from 'styled-components'

const FullHeightDiv = styled.div`
  height: 100%;
`;


const Layout = props => (
  <FullHeightDiv>
    <NavBar />
    <FullHeightDiv>
      {props.children}
    </FullHeightDiv>
  </FullHeightDiv>
);

export default Layout;