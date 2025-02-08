const axios = require('axios');

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

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama2-70b-4096",
      messages: [
        {
          role: "system",
          content: `You are a large language AI assistant. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context and cite the context at the end of each sentence if applicable.\n\nContext:\n${formattedContext}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.5,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Answer generation error:', error);
    throw new Error('Failed to generate answer');
  }
}

module.exports = {
  searchWithSerper,
  generateAnswer
};
