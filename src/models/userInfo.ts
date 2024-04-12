export default {
  namespace: "userInfo",
  state: {
    userInfo: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, userInfo: payload };
    },
  },
};
