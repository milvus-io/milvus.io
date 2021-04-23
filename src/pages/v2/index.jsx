import React from 'react';
import { graphql, navigate } from 'gatsby';
import './index.scss'

const HomePage = ({data,pageContext})=>{
  console.log(data,pageContext)
  const {banner,content,footer} = data.allFile.edges[18].node.childLayoutJson.v2;


  return (
    <div className='home-page-container'>
      
    </div>
  )
}

export const Query = graphql`
  query V2HomeQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            v2 {
              banner {
                title
                startBtn {
                  href
                  label
                }
              }
              content {
                title
                list {
                  title
                  text
                  img
                }
              }
              footer {
                list {
                  title
                  text
                  href
                  label
                  icons
                }
                licence {
                  text1 {
                    label
                    link
                  }
                  text2 {
                    label
                    link
                  }
                  list {
                    label
                    link
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default HomePage