export default function handler(req, res) {
  res.status(200).json({
    inkeepApiKey: process.env.INKEEP_API_KEY,
  });
}
