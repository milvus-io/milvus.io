import imageSearch from '../../images/milvus-demos/image-search.png';
import chemical from '../../images/milvus-demos/chemical-search.svg';
import chatBot from '../../images/milvus-demos/chat-bots.svg';

export const DEMOS = [
  {
    name: 'Image Search',
    desc: 'Images made searchable. Instantaneously return the most similar images from a massive database.',
    // link: 'http://35.166.123.214:8004/#/',
    href: '/milvus-demos/reverse-image-search',
    coverImg: imageSearch,
    videoLink: 'https://www.youtube.com/watch?v=hkU9hJnhGsU',
    lowerCaseName: 'image search',
  },
  {
    name: 'Chatbots',
    desc: 'Interactive digital customer service that saves users time and businesses money.',
    href: 'http://35.166.123.214:8005/',
    coverImg: chatBot,
    videoLink: 'https://www.youtube.com/watch?v=UvhL2vVZ-f4',
    lowerCaseName: 'chatbots',
  },
  {
    name: 'Chemical Structure Search',
    desc: 'Blazing fast similarity search, substructure search, or superstructure search for a specified molecule.',
    href: 'http://35.166.123.214:8002/',
    coverImg: chemical,
    videoLink: 'https://www.youtube.com/watch?v=4u_RZeMBTNI',
    lowerCaseName: 'chemical',
  },
];
