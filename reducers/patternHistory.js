import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: [{}],
};

export const patternHistorySlice = createSlice({
    name: 'patternHistory',
    initialState,
    reducers: {
        addHistoryPattern: (state, action) => {
            state.value.push(action.payload);
        },

    },
});

export const { addHistoryPattern } = patternHistorySlice.actions;
export default patternHistorySlice.reducer;
