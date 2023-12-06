import { apiSlice } from './apiSlice';
const QUIZZES_URL = '/api/quizzes';

export const quizzesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      // gets an array of quiz ids of all public quizzes
      query: (data) => ({
        url: `${QUIZZES_URL}?page=${data.page}&sort=${data.sort}&filter=${data.filter}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Quiz', id: 'PUBLIC' }],
    }),
    getQuiz: builder.query({
      // gets quiz details by id
      query: (id) => ({
        url: `${QUIZZES_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Quiz', id }],
    }),
    addQuiz: builder.mutation({
      query: (data) => ({
        url: `${QUIZZES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.isPublic
          ? [
              { type: 'Quiz', id: 'USER' },
              { type: 'Quiz', id: 'PUBLIC' },
            ]
          : [{ type: 'Quiz', id: 'USER' }],
    }),
    removeQuiz: builder.mutation({
      query: (id) => ({
        url: `${QUIZZES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quiz'],
    }),
    updateQuiz: builder.mutation({
      query: (data) => ({
        url: `${QUIZZES_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) =>
        // if the quiz publication changed, invalidate the Quiz tag with id 'PUBLIC'
        result && result.publicationChange
          ? [
              { type: 'Quiz', id: arg._id },
              { type: 'Quiz', id: 'PUBLIC' },
            ]
          : [{ type: 'Quiz', id: arg._id }],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useAddQuizMutation,
  useRemoveQuizMutation,
  useUpdateQuizMutation,
} = quizzesApiSlice;
