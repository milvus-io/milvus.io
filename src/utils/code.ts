export const formatCodeContent = (content: string) => {
  const code = content
    .split('\n')
    .filter(item => item[0] !== '#')
    .map(str => {
      const invalidItems = ['$', '>>>'];
      return str
        .split(' ')
        .filter(s => !invalidItems.includes(s))
        .join(' ');
    })
    .join('\n');

  return code;
};
