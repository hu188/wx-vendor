export default {
  //判断是否为空
  isNull(item) {
    if (item == '' || item == undefined ||item == 'undefined' || item == null) {
      return true;
    } else {
      return false;
    }
  },
  //格式化数字
  formatNumber(n) {
    n = n.toString(); // eslint-disable-line
    return n[1] ? n : '0' + n;
  },
  //格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  },
  //去掉首位空格
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  //手机号码验证
  isMobile(str) {
  var reg = /^[1][0-9]{10}$/;
  return reg.test(str);
  },

};



