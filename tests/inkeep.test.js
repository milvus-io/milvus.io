const { test } = require('@playwright/test');

const MILVUS_DOC_URL = 'https://milvus.io/docs';
const CHAT_INPUT = 'Pharse Match';
const API_URL = 'https://api.inkeep.com/v1/chat/completions';

test('Zilliz chat interaction with API monitoring', async ({ page }) => {
  // Array to store API responses
  const apiResponses = [];
  let apiRequestFound = false;

  // Listen for API responses
  page.on('response', async response => {
    const url = response.url();
    if (url.includes(API_URL)) {
      apiRequestFound = true;
      const status = response.status();
      apiResponses.push({
        url,
        status,
      });

      console.info('response status: ', status);

      // Fail test if status is 4xx or 5xx
      if (status >= 400) {
        const responseBody = await response
          .text()
          .catch(() => 'Unable to get response body');
        throw new Error(
          `API Error: ${status} - ${url}\nResponse: ${responseBody}`
        );
      } else {
        console.info(
          'Test completed successfully. API responses:',
          apiResponses
        );
      }
    }
  });

  await page.goto(MILVUS_DOC_URL);

  try {
    const chatButton = page.locator('#inkeep-chat-button');
    console.log('chatButton: ', chatButton);
    await chatButton.click();

    // Wait for chat interface to appear
    await page.waitForSelector('.ikp-ai-chat-input__group', {
      state: 'visible',
      timeout: 10000,
    });

    // 3. Find the input area and type "test"
    const chatInput = page.locator('.ikp-ai-chat-input__group textarea');
    await chatInput.fill(CHAT_INPUT);

    // 4. Click the send button
    const sendButton = page.locator('button[aria-label="Send message"]');
    await sendButton.click();

    // Wait for API call to complete (up to 10 seconds)
    await page.waitForTimeout(10000);

    if (!apiRequestFound) {
      console.warn(
        'API request to https://api.inkeep.com/v1/chat/completions was not detected'
      );
    }

    console.log('Test completed successfully. API responses:', apiResponses);
  } catch (error) {
    console.error('Test failed:', error);
    // Attach API responses to error for debugging
    error.apiResponses = apiResponses;
    throw error;
  }
});
