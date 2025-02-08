const express = require('express');
const router = express.Router();
const Search = require('../models/search');
const { searchWithSerper, generateAnswer } = require('../utils/searchUtils');

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Get search results
    const searchResults = await searchWithSerper(query);
    
    // Generate answer using the search results
    const answer = await generateAnswer(query, searchResults);
    
    // Generate related questions (simplified version)
    const relatedQuestions = [
    `What are the key differences between ${query}?`,
    `How does ${query} impact daily life?`,
    `What are the latest developments in ${query}?`,
    `What is the history behind ${query}?`,
    `What are some real-world applications of ${query}?`,
    `How does ${query} compare to similar concepts?`,
    `What are the pros and cons of ${query}?`,
    `What future trends are expected in ${query}?`,
    `What are the most common misconceptions about ${query}?`,
    `How do experts in the field view ${query}?`,
    `What role does ${query} play in modern technology?`,
    `How can ${query} be used in different industries?`,
    `What are some famous case studies related to ${query}?`,
    `What ethical concerns are associated with ${query}?`,
    `How has ${query} evolved over time?`,
    `What are the fundamental principles behind ${query}?`,
    `What skills are required to master ${query}?`,
    `What are the best resources for learning about ${query}?`,
    `What are the economic impacts of ${query}?`,
    `What scientific research supports ${query}?`,
    `How does ${query} relate to sustainability and the environment?`,
    `What are the most debated topics regarding ${query}?`,
    `How do different cultures view ${query}?`
    ];
    
    // Save search to database
    const search = new Search({
      query,
      results: searchResults,
      answer,
      relatedQuestions
    });
    await search.save();
    
    res.json({
      success: true,
      data: {
        answer,
        searchResults,
        relatedQuestions
      }
    });
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const searches = await Search.find()
      .sort({ timestamp: -1 })
      .limit(10);
      
    res.json({
      success: true,
      data: searches
    });
  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



module.exports = router;

