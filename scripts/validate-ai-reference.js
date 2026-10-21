const {
  loadPublishedFaqRows,
  publication,
} = require('../src/server/ai-reference-catalog');

loadPublishedFaqRows()
  .then(rows => {
    const reviewed = rows.filter(
      row => publication[row.URL].status === 'source-checked'
    ).length;
    console.log(
      `AI reference: ${rows.length} published, ${reviewed} source-checked.`
    );
  })
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
