import { createSlice } from "@reduxjs/toolkit";
import { IUIState, ReducersNames } from "../../types";

const initialState: IUIState = {
  modal: {
    isOpen: false,
  },
};

export const uiSlice = createSlice({
  name: ReducersNames.UI,
  initialState,
  reducers: {
    showModal(state) {
      state.modal.isOpen = true;
    },
    hideModal(state) {
      state.modal.isOpen = false;
    },
  },
});

export const { actions: uiActions, reducer: uiReducer } = uiSlice;
