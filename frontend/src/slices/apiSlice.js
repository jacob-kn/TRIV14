import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['User', 'Quiz'],
  endpoints: (builder) => ({}),
  refetchOnReconnect: true,
});
