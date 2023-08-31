import { app } from "./app.js";

// Set conversation configuration for OpenAI chat
const setConversationConfig = (question, accessToken) => {
    window.config = {
        accessToken: accessToken,
        question: question,
    }
}

// Get conversation from OpenAI chat
export const getConversation = (question, accessToken) => {
    // Execute script to set conversation configuration
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId: app.chatGPTTabId },
            func: setConversationConfig,
            args: [question, accessToken],
        }).then(() => {
            // Execute scripts to fetch SSE (stream) and get conversation
            chrome.scripting.executeScript({
                target: { tabId: app.chatGPTTabId },
                files: [
                    'background/inoculates/sse-browser-fetch.js',
                    'background/inoculates/conversation-get-inj.js'
                ],
            });
            resolve(true);
        });
    });
}