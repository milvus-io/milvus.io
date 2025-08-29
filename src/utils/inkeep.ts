import { z } from 'zod';

const answerConfidence = z
  .union([
    z.literal('very_confident').describe(`
    The AI Assistant provided a complete and direct answer to all parts of the User Question.
    The answer fully resolved the issue without requiring any further action from the User.
    Every part of the answer was cited from the information sources.
    The assistant did not ask for more information or provide options requiring User action.
    This is the highest Answer Confidence level and should be used sparingly.
  `),
    z.literal('somewhat_confident').describe(`
    The AI Assistant provided a complete and direct answer to the User Question, but the answer contained minor caveats or uncertainties. 
 
    Examples:
    • The AI Assistant asked follow-up questions to the User
    • The AI Assistant requested additional information from the User
    • The AI Assistant suggested uncertainty in the answer
    • The AI Assistant answered the question but mentioned potential exceptions
  `),
    z.literal('not_confident').describe(`
    The AI Assistant tried to answer the User Question but did not fully resolve it.
    The assistant provided options requiring further action from the User, asked for more information, showed uncertainty,
    suggested the user contact support or provided contact information, or provided an indirect or incomplete answer.
    This is the most common Answer Confidence level.
 
    Examples:
    • The AI Assistant provided a general answer not directly related to the User Question
    • The AI Assistant said to reach out to support or provided an email address or contact information
    • The AI Assistant provided options that require further action from the User to resolve the issue
  `),
    z.literal('no_sources').describe(`
    The AI Assistant did not use or cite any sources from the information sources to answer the User Question.
  `),
    z.literal('other').describe(`
    The User Question is unclear or unrelated to the subject matter.
  `),
  ])
  .describe(
    'A measure of how confidently the AI Assistant completely and directly answered the User Question.'
  );

const provideAnswerConfidenceSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A brief few word justification of why a specific confidence level was chosen.'
    ),
  answerConfidence,
});

const salesSignalType = z
  .union([
    z.literal('requested_sales_contact').describe(`
    The user has explicitly asked to speak with a sales representative or sales team.
    
    Examples:
    • "Can I talk to someone from sales?"
    • "How do I contact your sales team?"
    • "I'd like to schedule a call with a sales rep"
    • "Is there someone I can talk to about purchasing?"
  `),
    z.literal('pricing_inquiry').describe(`
    The user has asked about pricing, costs, billing, or payment options.
    
    Examples:
    • "How much does this service cost?"
    • "What's the pricing for the enterprise plan?"
    • "Do you offer annual billing discounts?"
    • "What would it cost for our team of 50 people?"
  `),
    z.literal('enterprise_features').describe(`
    The user has inquired about enterprise-specific features, capabilities, or requirements.
    
    Examples:
    • "Do you support SSO integration?"
    • "What security certifications do you have?"
    • "Is there an on-premise deployment option?"
    • "Do you have custom SLAs for enterprise customers?"
  `),
    z.literal('upgrade_inquiry').describe(`
    The user has asked about upgrading their current plan or moving to a higher tier.
    
    Examples:
    • "How do I upgrade to the Pro plan?"
    • "What's involved in moving from Basic to Enterprise?"
    • "I'm hitting limits on my current plan and need to upgrade"
    • "What additional features do I get if I upgrade?"
  `),
    z.literal('implementation_services').describe(`
    The user has asked about professional services, implementation support, or consulting.
    
    Examples:
    • "Do you offer implementation services?"
    • "Can you help us migrate our data?"
    • "Do you have consultants who can help us set this up?"
    • "What kind of onboarding support do you provide?"
  `),
    z.literal('comparison_competitive').describe(`
    The user is comparing the product with competitors or alternatives.
    
    Examples:
    • "How do you compare to [Competitor]?"
    • "What makes your solution better than [Alternative]?"
    • "Why should we choose you instead of [Competitor]?"
    • "What's your advantage over other solutions?"
  `),
    z.literal('trial_demo_request').describe(`
    The user has requested a product demo or trial.
    
    Examples:
    • "Can I get a demo of your product?"
    • "How do I sign up for a trial?"
    • "I'd like to see the product in action"
    • "Do you offer proof of concept engagements?"
  `),
  ])
  .describe("Specific type of sales signal detected in the user's question");

const detectedSalesSignal = z.object({
  explanation: z
    .string()
    .describe(
      'A brief few word justification of why a specific sales signal was chosen.'
    ),
  type: salesSignalType,
});

const supportSignalType = z
  .union([
    z.literal('technical_issue').describe(`
      The user is reporting a bug, error, crash, timeout, or unexpected system behavior that blocks or disrupts usage.
      Examples:
      • "Request timed out."
      • "Fail to start with docker compose."
      • "Pod crashes due to panics when syncing segment"
      • "RootCoordClient message key not exist"
      • "Failed to load collection."
      • "Quota exceeded"
      • "Fail to connect S3 with CA certs."
      • "Inconsistent search results when topK is large."
    `),

    z.literal('deployment_and_setup').describe(`
      The user is asking about how to install, configure, or tune Milvus.
      Examples:
      • "How do I configure Milvus to use external MinIO?"
      • "How to upgrade from Milvus 2.4 to 2.6?"
      • "How do I set resource limits for index nodes?"
    `),

    z.literal('system_operations').describe(`
      The user is asking about managing or operating a running Milvus system, including monitoring, scaling, and maintenance.
      • "How do I monitor Milvus metrics in Prometheus/Grafana?"
      • "What’s the best way to scale query nodes horizontally?"
      • "How can I back up and restore Milvus data?"
      • "How to perform rolling upgrades without downtime?"
    `),

    z.literal('data_and_performance').describe(`
      The user is experiencing missing data, incorrect query results, or performance problems.
      Examples:
      • "Inserted data not returned in query results."
      • "Deleted entities still appear in search results."
      • "Index building takes 10x longer than expected."
      • "Queries take several seconds instead of milliseconds."
    `),

    z.literal('integration_and_solutions').describe(`
      The user is blocked or has questions while integrating Milvus with external systems, frameworks, or building/operating solutions on top of it.
      Examples:
      • "LangChain integration throws connection errors."
      • "Building a semantic search solution but results are poor."
      • "Do you support Pinecone migration?"
      • "How do I design schema for a product search pipeline?"
    `),

    z.literal('ai_low_confidence_or_docs_missing').describe(`
      The AI assistant was unable to provide a confident or complete answer due to vague input or lack of documentation.
      Examples:
      • "I don't know."
      • "I can't find relevant information in the documentation."
      • "You should reach out the community."
      • "Let's try something else."
    `),

    z.literal('direct_support_request').describe(`
      The user is explicitly requesting to contact support or asking for human assistance.
      Examples:
      • "Can I talk to support?"
      • "I need help"
      • "Is there someone I can speak to?"
    `),
  ])
  .describe("General type of support signal detected in the user's message.");

const detectedSupportSignal = z.object({
  explanation: z
    .string()
    .describe('Short justification for why this is a support-related message.'),
  type: supportSignalType,
});

export {
  answerConfidence,
  provideAnswerConfidenceSchema,
  salesSignalType,
  detectedSalesSignal,
  supportSignalType,
  detectedSupportSignal,
};
