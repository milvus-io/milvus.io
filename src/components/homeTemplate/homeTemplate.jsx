import React from 'react';
import BlogCard from '../card/blogCard/blogCard';
import StartCard from '../card/startCard/startCard';
import './homeTemplate.scss';

const HomeTemplate = ({ data }) => {
  const { section1, section2, section3, section4 } = data;

  return (
    <section className="home-wrapper">
      <div className="section section-1">
        <h1>{section1.title}</h1>
        <div className="section-1-card-wrapper">
          {section1.items.map(item => (
            <StartCard
              key={item.title}
              data={item}
              wrapperClass="section-1-card-item"
            />
          ))}
        </div>
      </div>

      <div className="section section-2">
        <h1>{section2.title}</h1>
        <p className="section-2-desc">{section2.desc}</p>
      </div>

      <div className="section section-3">
        <h1>{section3.title}</h1>
        <div className="section-3-item-wrapper">
          {section3.items.map(item => (
            <div key={item.label}>
              <h4>{item.label}</h4>
              <ul className="section-3-link-wrapper">
                {item.list.map(link => (
                  <li key={link.text}>
                    <a href={link.link}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h1>{section4.title}</h1>
        <div>
          {section4.items.map(item => (
            <BlogCard key={item.title} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTemplate;
