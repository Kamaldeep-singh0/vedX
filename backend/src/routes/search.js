const express = require('express');
const router = express.Router();
const Search = require('../models/search');
const { searchWithSerper, generateAnswer, generateRelatedQuestions } = require('../utils/searchUtils');

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Get search results
    const searchResults = await searchWithSerper(query);
    
    // Generate answer using the search results
    const answer = await generateAnswer(query, searchResults);
    
    // Generate related questions using OpenAI
    const relatedQuestions = await generateRelatedQuestions(query, searchResults);
    
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
