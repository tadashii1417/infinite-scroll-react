import useBookSearch from './useBookSearch';
import { useState, useRef, useCallback } from 'react';

// useRef store value that persist after each render !!!
// useCallback can be used as ref

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })

    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div className='app'>
      <input name="text" value={query} onChange={handleSearch}></input>

      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div key={book} ref={lastBookElementRef}>{book}</div>
        }
        return <div key={book}>{book}</div>;
      }
      )}

      <div>{loading && 'loading ...'}</div>
      <div>{error && 'error ...'}</div>
    </div>
  );
}

export default App;
