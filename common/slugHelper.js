function removeSpace(str) {
    // Change to lower case
    str = str.toLowerCase();

    // remove unicode character
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');
    str = str.replace(/( )/g, ' ');
    // remove special character
    str = str.replace(/([^%$0-9a-z-\s])/g, '');

    // remove the space and change it into -
    str = str.replace(/(\s+)/g, '-');

    // remove the - character at the first
    str = str.replace(/^-+/g, '');

    // remove the - character at the end
    str = str.replace(/-+$/g, '');
    // return
    return str.trim();
  }


  module.exports = { removeSpace }