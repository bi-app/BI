
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.warn(err);
    },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
};
