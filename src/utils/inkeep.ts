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

export {
  answerConfidence,
  provideAnswerConfidenceSchema,
  salesSignalType,
  detectedSalesSignal,
};
