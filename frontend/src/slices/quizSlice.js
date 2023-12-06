import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizId: null,
  roomCode: null,
  answer: "no answer",
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
    setAnswer: (state, action) => {
      state.answer = action.payload;
    },
    clearQuizInfo: (state) => {
      state.quizId = null;
      state.roomCode = null;
    },
  },
});

export const { setQuizId, setQuizRoomCode, setAnswer, clearQuizInfo } = quizSlice.actions;
export const selectQuizId = (state) => state.quizInfo.quizId;
export const selectQuizRoomCode = (state) => state.quizInfo.roomCode;
export const selectAnswer = (state) => state.quizInfo.answer;

export default quizSlice.reducer;