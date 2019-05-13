export default {
  //判断是否为空
  isNull(item) {
    if (item == '' || item == undefined || item == null) {
      return true;
    } else {
      return false;
    }
  },
  //去掉首位空格
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
};
