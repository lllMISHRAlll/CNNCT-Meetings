import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    topic: "",
    password: "",
    host: "",
    description: "",
    date: "",
    time: "",
    period: "AM",
    timezone: "",
    duration: "1 hr",
    link: "",
    emails: "",
  },
  toggleBanner: false,
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    },
    toggleBanner: (state, action) => {
      state.toggleBanner = action.payload;
    },
  },
});

export const { updateFormData, toggleBanner, resetForm } = meetingSlice.actions;
export default meetingSlice.reducer;
