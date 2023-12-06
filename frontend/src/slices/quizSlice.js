import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizId: null,
  roomCode: null,
};

export const quizSlice = createSlice({
  name: "quizInfo",
  initialState,
  reducers: {
    setQuizId: (state, action) => {
      state.quizId = action.payload;
    },
    setQuizRoomCode: (state, action) => {
      state.roomCode = action.payload;
    },
    clearQuizInfo: (state) => {
      state.quizId = null;
      state.roomCode = null;
    },
  },
});

export const { setQuizId, setQuizRoomCode, clearQuizInfo } = quizSlice.actions;
export const selectQuizId = (state) => state.quizInfo.quizId;
export const selectQuizRoomCode = (state) => state.quizInfo.roomCode;

export default quizSlice.reducer;