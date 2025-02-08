export const searchQuery = async (query) => {
    try {
      const res = await fetch('http://localhost:5000/api/search/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to fetch search results');
    }
  };