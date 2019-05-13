const ascii = new Array("a","b","c","d","e","f","g","G","h","H","i","I","j","J","k","K","l","L","m","M","n","N","o","O","p","P","q","Q","r","R","s","S","t","T","u","U","v","w","x","y","z")
var encode = function(params, sessionId) {
   let arr = [];
   for (var key in params) {
      arr.push(key)
   }
   arr.sort();
   let str = '';
   for (var i in arr) {
      str += arr[i] + "=" + params[arr[i]] + "&"
   }
   str = str.substr(0, str.length - 1)
   var b = str.split('').map(s);
   var key = sessionId.split('').map(s);
   var allKey = [];
   if (b.length > key.length) {
      var times = b.length / key.length;
      if (times != 0) {
         allKey = new Array(Math.floor(key.length * (times + 1)));
      }
   }
   if (allKey != null) {
      for (var i = 0; i < allKey.length; i++) {
         allKey[i] = key[i % key.length];
      }
   } else {
      allKey = key;
   }
   let sbs = "",sb = '';
   for (var i = 0, j = b.length; i < j; i++) {
      sbs = sbs + b[i] + (",");
      var value = parseInt(Math.abs(b[i] - allKey[i]) / ascii.length);
      if (b[i] - allKey[i] > 0) {
         sb = sb + (value == 0 ? "" : value == 1 ? "B" : value == 2 ? "C" : value == 3 ? "D" : value == 4 ? "E" : "F") + (ascii[Math.abs(b[i] - allKey[i]) % ascii.length]);
      } else {
         sb = sb + (value == 0 ? "A" : value == 1 ? "V" : value == 2 ? "W" : value == 3 ? "X" : value == 4 ? "Y" : "Z") + (ascii[Math.abs(b[i] - allKey[i]) % ascii.length]);
      }
   }
   return sb;
}
function s(x) { return x.charCodeAt(0); }
module.exports = {
   encode : (params, sessionId) => {
      return encode(params, sessionId);
   }
}