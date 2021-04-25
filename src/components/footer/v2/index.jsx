import React, { useMemo } from 'react';
import V2Button from '../../V2Button';
import qrcode from '../../../images/qrcode.jpeg';
import milvusUserWechat from '../../../images/milvus-user-wechat.png';
import medium from '../../../images/website/community/medium.svg';
import slack from '../../../images/website/community/slack.svg';
import twitter from '../../../images/website/community/twitter.svg';
import wechat from '../../../images/website/community/wechat.svg';
import './index.scss';

const iconSet = {
  medium,
  slack,
  twitter,
  wechat
}

const V2Footer = ({ footer }) => {
  const { list: links, licence: { text1, text2, list } } = footer;
  console.log(list);

  return (
    <div className='footer-container'>
      <ul className="footer-list">
        {
          links.map(i => {
            const { title, text, href, label, icons } = i;
            return (
              <li className='list-item' key={title}>
                <p className="footer-list-title">{title}</p>
                <p className="footer-list-content">{text}</p>
                {
                  href ?
                    (<V2Button
                      label={label}
                      href={href}
                      type='link'
                      variant='text'
                      className="footer-list-btn"
                    />) :
                    (<ImageList images={icons} />)
                }

              </li>
            )
          })
        }
      </ul>
      <div className="footer-licence">
        <div className="licence-milvus">
          <a href={text1.link}>{text1.label}</a>
          <a href={text2.link}>{text2.label}</a>
        </div>
        <div className="licence-policy">
          {
            list.map(i => (
              <a href={i.link} target="_blank" rel="noopener noreferrer" key={i.label}>{i.label}</a>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const ImageList = ({ images }) => {
  return useMemo(() => {
    return (
      <p className='images-wrapper'>
        {
          images.map(img => (
            <a 
              href={img.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`column-img ${img.name==='wecgat'? 'hover-btn':''}`} 
              key={img.name}
            >
              <img src={iconSet[img.name]} alt={img.name} />
              {
                img.name==='wechat' && (
                  <p className='qrcode-wrapper'>
                    <img src={qrcode} alt="qrcode"/>
                    <img src={milvusUserWechat} alt="qrcode"/>
                  </p>
                )
              }
            </a>
          ))
        }
      </p>
    )
  }, [images])
}

export default V2Footer