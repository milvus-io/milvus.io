import React from 'react';
import CollapsibleMenu from '../components/collapsibleMenu';
import { graphql } from "gatsby";

const TestPage = () => {

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex' }}>
      {/* menu */}
      <div style={{ width: 'fit-content' }}>
        <CollapsibleMenu>
          <div className="">this is content</div>
        </CollapsibleMenu>
      </div>

      {/* content */}
      <div style={{ flex: 1, background: 'gray', padding: '20px' }}>
        <p>hahaha</p>
        <br />
        <br />
        <p>heihei</p>
      </div>
    </div>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;

export default TestPage;
