import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Clock, Share2 } from 'lucide-react';

const sampleResponses = [
  "Based on your query, here's what I found...",
  "Let me analyze that for you...",
  "Here's what you need to know...",
  "According to my analysis..."
];

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    // Check if query exists in location state
    if (!location.state?.query) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
      setIsGenerating(false);
      setRecentQueries(prev => [location.state.query, ...prev.slice(0, 2)]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (!location.state?.query) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-zinc-800 p-4 hidden lg:block">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
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
              <p className="text-white font-medium">{location.state.query}</p>
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