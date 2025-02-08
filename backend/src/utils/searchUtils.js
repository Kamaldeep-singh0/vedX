const axios = require('axios');
const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function searchWithSerper(query) {
  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: query,
      num: 8
    }, {
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    
    const contexts = [];
    
    if (response.data.knowledgeGraph) {
      const kg = response.data.knowledgeGraph;
      if (kg.descriptionUrl || kg.website) {
        contexts.push({
          name: kg.title || "",
          url: kg.descriptionUrl || kg.website,
          snippet: kg.description
        });
      }
    }

    if (response.data.organic) {
      contexts.push(...response.data.organic.map(item => ({
        name: item.title,
        url: item.link,
        snippet: item.snippet
      })));
    }

    return contexts.slice(0, 8);
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search engine error');
  }
}

async function generateAnswer(query, contexts) {
    try {
      const formattedContext = contexts.map((ctx, i) => 
        `[[citation:${i + 1}]] ${ctx.snippet}`
      ).join('\n\n');
  
      const systemPrompt = `You are a large language AI assistant. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context and cite the context at the end of each sentence if applicable.
  
      Context:
      ${formattedContext}`;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4-0125-preview", // You can also use "gpt-3.5-turbo" for lower cost
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.5,
        max_tokens: 1024
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Answer generation error:', error);
      throw new Error('Failed to generate answer');
    }
  }
  
  // Add function to generate related questions using OpenAI
  async function generateRelatedQuestions(query, contexts) {
    try {
      const formattedContext = contexts.map(ctx => ctx.snippet).join('\n\n');
  
      const systemPrompt = `Based on the following context and original question, generate 3 relevant follow-up questions. Make questions specific and standalone, including full context. Format as numbered list.
  
      Context:
      ${formattedContext}`;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using 3.5 for cost efficiency on simpler task
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Original question: ${query}`
          }
        ],
        temperature: 0.7,
        max_tokens: 256
      });
  
      // Extract questions from the response
      const response = completion.choices[0].message.content;
      const questions = response.split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
  
      return questions;
    } catch (error) {
      console.error('Related questions generation error:', error);
      return [
        `What are the key aspects of ${query}?`,
        `How does ${query} impact modern society?`,
        `What are the latest developments in ${query}?`
      ];
    }
  }
  
  module.exports = {
    searchWithSerper,
    generateAnswer,
    generateRelatedQuestions
  };
