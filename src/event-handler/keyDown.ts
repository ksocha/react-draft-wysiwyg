let callBacks = [];

export default {
  onKeyDown: (event: {
    [key: string]: any;
  }) => {
    callBacks.forEach(callBack => {
      callBack(event);
    });
  },

  registerCallBack: (callBack): void => {
    callBacks.push(callBack);
  },

  deregisterCallBack: (callBack): void => {
    callBacks = callBacks.filter(cb => cb !== callBack);
  }
};