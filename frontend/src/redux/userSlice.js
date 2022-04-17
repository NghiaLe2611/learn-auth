import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: {
            allUser: null,
            isFetching: false,
            error: false
        },
        message: ''
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isFetching = true;
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.error = false;
            state.users.allUser = action.payload;
        },
        getUserFailed: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart: (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.error = false;
            state.message = action.payload;
        },
        deleteUserFailed: (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.message = action.payload;
        }
    }
});

export const { getUserStart, getUserSuccess, getUserFailed,
    deleteUserStart, deleteUserSuccess, deleteUserFailed
} = userSlice.actions;
export default userSlice.reducer;
