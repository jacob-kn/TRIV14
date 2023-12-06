import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { toast } from 'react-toastify';
import { useGetQuizzesQuery } from '../slices/quizzesApiSlice';

import Loader from '../components/Loader';
import Spinner from '../components/Spinner';
import BgFlourish from '../components/BgFlourish';
import QuizCard from '../components/QuizCard';
import Pagination from '../components/Pagination';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

function Quizzes() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');
  const [filter, setFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const { data, isLoading, isFetching, isError } = useGetQuizzesQuery({
    page,
    sort,
    filter,
  });

  const quizzes = data?.quizzes;
  const totalPages = data?.totalPages;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = () => {
    setFilter(selectedTags.join(','));
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  // Function to handle tag selection
  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedTags]);

  return (
    <>
      <BgFlourish flourish="3" />

      <div className="mx-4 my-8 sm:mx-20">
        <div className="flex flex-col items-center gap-4 my-8">
          <h1 className="text-white text-3xl font-bold text-center">
            Community Quizzes
          </h1>
          <div className="flex justify-center flex-wrap gap-4 m-4 mb-0">
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('Math')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Math')}
            >
              Math
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('Science')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Science')}
            >
              Science
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('History')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('History')}
            >
              History
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('Geography')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Geography')}
            >
              Geography
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('Literature')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Literature')}
            >
              Literature
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full whitespace-nowrap ${
                selectedTags.includes('Pop Culture')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Pop Culture')}
            >
              Pop Culture
            </button>
            <button
              className={`hover:opacity-80 font-bold py-2 px-4 rounded-full ${
                selectedTags.includes('Other')
                  ? 'bg-gray-200 text-bunker-200'
                  : 'bg-surface text-white'
              }`}
              onClick={() => handleTagSelection('Other')}
            >
              Other
            </button>
          </div>
          <div className="flex gap-4">
            <select
              className="bg-surface text-white font-bold px-4 py-3 rounded hover:cursor-pointer hover:opacity-80"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="-plays">Most Plays</option>
              <option value="plays">Least Plays</option>
            </select>
          </div>
        </div>

        {isLoading || isFetching ? (
          <Spinner />
        ) : isError ? (
          <div className="flex justify-center">
            <h3 className="text-gray-200 flex gap-2">
              <ExclamationCircleIcon className="w-6 h-6" />
              Could not load quizzes. Please try again later.
            </h3>
          </div>
        ) : !quizzes.length ? (
          <div className="flex justify-center">
            <h3 className="text-gray-200">
              There are no quizzes for the selected criteria.
            </h3>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-8 max-w-[1500px]">
              {quizzes.map((quizId) => (
                <QuizCard key={quizId} quizId={quizId} />
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Quizzes;
