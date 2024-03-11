import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: [],
    currentIndex: -1,
};

const patternHistorySlice = createSlice({
    name: 'patternHistory',
    initialState: {
        value: [],
        currentIndex: -1,
    },
    reducers: {
        addHistoryPattern: (state, action) => {
            // Tronquer l'historique si on fait une nouvelle action après des undos
            state.value = state.value.slice(0, state.currentIndex + 1);
            state.value.push(action.payload);
            state.currentIndex = state.value.length - 1;
        },
        undoHistoryPattern: (state) => {
            state.currentIndex = Math.max(0, state.currentIndex - 1);
        },
        redoHistoryPattern: (state) => {
            state.currentIndex = Math.min(state.value.length - 1, state.currentIndex + 1);
        },
        clearHistory: (state) => {
            state.value = [];
            state.currentIndex = -1;
        },
    },
});


export const { addHistoryPattern, clearHistory, undoHistoryPattern, redoHistoryPattern } = patternHistorySlice.actions;
export default patternHistorySlice.reducer;
