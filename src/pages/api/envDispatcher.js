export default function handler(req, res) {
  res.status(200).json({
    mServiceUrl: process.env.MSERVICE_URL,
    cmsBaseUrl: process.env.CMS_BASE_URL,
    repoStaticsKey: process.env.REPO_STATICS_KEY,
    inkeepApiKey: process.env.INKEEP_API_KEY,
    inkeepIntegrationId: process.env.INKEEP_INTEGRATION_ID,
    inkeepOrganizationId: process.env.INKEEP_ORGANIZATION_ID,
  });
}
