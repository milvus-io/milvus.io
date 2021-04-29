import axiosInstance from './http';

export async function searchByElasic(query, index) {
  const res = await axiosInstance.post('/strapi-plugin-elasticsearch/search', {
    index,
    body: {
      query: {
        multi_match: {
          fields: ['content', 'fileId'],
          query,
          fuzziness: 'AUTO',
        },
      },
      highlight: {
        fields: {
          title: {
            fragment_size: 100,
          },
          content: {
            fragment_size: 300,
            number_of_fragments: 1,
          },
        },
      },
    },
  });
  const results = res.data.data.body.hits.hits;
  console.log(results);

  return results.map(v => ({ ...v._source, ...v.highlight }));
}
