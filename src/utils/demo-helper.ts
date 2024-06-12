export function getImgUrl(file) {
  let url = null;
  if (URL.createObjectURL) {
    // basic
    url = URL.createObjectURL(file);
  } else if (window.URL) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

export function convertBase64UrlToBlob(base64) {
  var urlData = base64.dataURL;
  var type = base64.type;
  var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: type });
}

export function getBase64Image(img) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  var dataURL = canvas.toDataURL('image/' + ext);
  return {
    dataURL: dataURL,
    type: 'image/' + ext,
  };
}
