
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.warn("报错：",err);
    },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
};
