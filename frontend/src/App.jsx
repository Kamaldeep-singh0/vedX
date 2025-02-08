import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, MessageSquare, Link2, Clock, ChevronRight, Share2 } from 'lucide-react';

const translations = [
  "What do you want to ask?",
  "आप क्या पूछना चाहते हैं?",
  "ਤੁਸੀਂ ਕੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
  "আপনি কি জিজ্ঞাসা করতে চান?",
  "तुम्हाला काय विचारायचे आहे?",
  "మీరు ఏమి అడగాలనుకుంటున్నారు?"
];

// Sample responses for demo
const sampleResponses = [
  "Based on your query, here's what I found...",
  "Let me analyze that for you...",
  "Here's what you need to know...",
  "According to my analysis..."
];

function TypewriterEffect() {
  const [text, setText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentPhrase = translations[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 50 : 2000;
    
    if (!isDeleting && text === currentPhrase) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }
    
    if (isDeleting && text === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % translations.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setText(prev => {
        if (isDeleting) return prev.slice(0, -1);
        return currentPhrase.slice(0, prev.length + 1);
      });
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentPhraseIndex]);

  return (
    <span className="text-4xl font-bold text-white">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function SearchResults({ query, onBack }) {
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    // Simulate AI response generation
    const timer = setTimeout(() => {
      setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
      setIsGenerating(false);
      setRecentQueries(prev => [query, ...prev.slice(0, 2)]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-zinc-800 p-4 hidden lg:block">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold tracking-tight"
          >
            VedX
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg text-zinc-300">
            <MessageSquare className="w-4 h-4" />
            <span>Recent Searches</span>
          </div>
          {recentQueries.map((q, index) => (
            <div key={index} className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-h-screen overflow-auto">
        {/* Query Card */}
        <div className="sticky top-0 bg-black border-b border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-zinc-400 text-sm">Your Query</span>
                </div>
                <Share2 className="w-4 h-4 text-zinc-400 hover:text-purple-400 cursor-pointer" />
              </div>
              <p className="text-white font-medium">{query}</p>
            </div>
          </div>
        </div>

        {/* Response Section */}
        <div className="max-w-3xl mx-auto p-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="prose prose-invert">
                <p className="text-zinc-300 leading-relaxed">{response}</p>
              </div>

              {/* Follow-up Questions */}
              <div className="mt-8">
                <h3 className="text-white font-medium mb-4">Follow-up Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Tell me more about this",
                    "What are the key points?",
                    "Can you provide examples?",
                    "How does this work?"
                  ].map((q, i) => (
                    <button
                      key={i}
                      className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-left text-zinc-300 hover:border-zinc-700 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery);
      setIsSearching(true);
    }
  };

  const handleBack = () => {
    setIsSearching(false);
    setSearchQuery('');
    setSubmittedQuery('');
  };

  if (isSearching) {
    return <SearchResults query={submittedQuery} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
            VedX
          </h2>
          <div className="h-16 flex items-center justify-center">
            <TypewriterEffect />
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              placeholder="Ask anything..."
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto group"
          >
            Ask Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✨', title: 'Lightning Fast', desc: 'Get instant answers to your questions' },
            { icon: '🔮', title: 'AI-Powered', desc: 'Powered by advanced artificial intelligence' },
            { icon: '🎯', title: 'Accurate Results', desc: 'Precise and relevant information' }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1 text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;