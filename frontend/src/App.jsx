import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, MessageSquare, Link2, Clock, ChevronRight, Share2 } from 'lucide-react';

const languages = [
  { text: "What do you want to ask?", lang: "English" },
  { text: "आप क्या पूछना चाहते हैं?", lang: "Hindi" },
  { text: "நீங்கள் என்ன கேட்க விரும்புகிறீர்கள்?", lang: "Tamil" },
  { text: "আপনি কি জিজ্ঞাসা করতে চান?", lang: "Bengali" },
  { text: "तुम्हाला काय विचारायचे आहे?", lang: "Marathi" },
  { text: "మీరు ఏమి అడగాలనుకుంటున్నారు?", lang: "Telugu" }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLangIndex((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchPage(true);
      setIsGenerating(true);
      // Simulate AI response generation
      setTimeout(() => setIsGenerating(false), 2000);
    }
  };

  if (isSearchPage) {
    return (
      <div className="min-h-screen bg-black flex">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-zinc-800 p-4 hidden lg:block">
          <div className="mb-6">
            <button
              onClick={() => setIsSearchPage(false)}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Search
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg text-zinc-300">
              <MessageSquare className="w-4 h-4" />
              <span>Recent Searches</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>How does AI work?</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>Latest AI trends</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-h-screen overflow-auto">
          {/* Top Search Bar */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-zinc-800 p-4">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ask a follow-up question..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Ask
              </button>
            </form>
          </div>

          {/* Content Area */}
          <div className="max-w-3xl mx-auto p-4">
            {/* Query Card */}
            <div className="mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-400 text-sm">Query</span>
                </div>
                <Share2 className="w-4 h-4 text-zinc-400 hover:text-emerald-400 cursor-pointer" />
              </div>
              <p className="text-white font-medium">{searchQuery}</p>
            </div>

            {/* Response Section */}
            {isGenerating ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-invert">
                  <p className="text-zinc-300 leading-relaxed">
                    Based on your query, here's a comprehensive analysis...
                    [AI-generated response would appear here with proper formatting,
                    citations, and relevant information]
                  </p>
                </div>

                {/* Sources */}
                <div className="mt-8">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-emerald-400" />
                    Sources
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <a
                        key={i}
                        href="#"
                        className="block p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium mb-1">Source Title {i}</h4>
                            <p className="text-zinc-400 text-sm">source-url-{i}.com</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Follow-up Questions */}
                <div className="mt-8">
                  <h3 className="text-white font-medium mb-4">Follow-up Questions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "How does this compare to other approaches?",
                      "What are the practical applications?",
                      "Can you explain the technical details?",
                      "What are the limitations?"
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Search</span>
          </div>
          <div className="h-16 flex items-center justify-center">
            <h1
              key={currentLangIndex}
              className="text-5xl font-bold text-white animate-fade-in"
              style={{
                animation: 'fadeIn 0.5s ease-in-out'
              }}
            >
              {languages[currentLangIndex].text}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg shadow-xl"
              placeholder="Ask anything..."
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 px-8 py-4 bg-emerald-500 text-black font-medium rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 mx-auto group"
          >
            Ask Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✨', title: 'Lightning Fast', desc: 'Get instant answers to your questions' },
            { icon: '🤖', title: 'AI-Powered', desc: 'Powered by advanced artificial intelligence' },
            { icon: '🎯', title: 'Accurate Results', desc: 'Precise and relevant information' }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl">
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