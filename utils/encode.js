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
   var b = [];
   str.split('').map(x => { return writeUTF(x, b) });
   var key = sessionId.split('').map( x => { return x.charCodeAt(0) });
   var allKey = [];
   if (b.length > key.length) {
      var times = b.length / key.length;
      if (times != 0) {
         allKey = new Array(Math.floor(key.length * (times + 1)));
      }
   }
   if (allKey != null && allKey!='') {
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

var writeUTF = function (str, b) {
   var code = str.charCodeAt(0);
   if (0x00 <= code && code <= 0x7f) {
      b.push(code);
   } else if (0x80 <= code && code <= 0x7ff) {
      b.push((192 | (31 & (code >> 6))));
      b.push((128 | (63 & code)))
   } else if ((0x800 <= code && code <= 0xd7ff)
      || (0xe000 <= code && code <= 0xffff)) {
      b.push(transferUtf8(224 | (15 & (code >> 12))));
      b.push(transferUtf8(128 | (63 & (code >> 6))));
      b.push(transferUtf8(128 | (63 & code)))
   }
}

function transferUtf8(num) {
   var answer = num.toString(2);
   var ss = answer.split('');
   var anStr = '0';
   for(var v = 1;v < ss.length; v++) {
      anStr += (ss[v] == 1?"0":"1");
   }
   return (parseInt(anStr, 2) + 1) * -1;
}

module.exports = {
   encode : (params, sessionId) => {
      return encode(params, sessionId);
   }
}