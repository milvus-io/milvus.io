self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  console.log('fetch url:', url);

  if (url.pathname.includes('_next/data')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            console.error('请求失败:', event.request.url, response.status);
            window.alert('检测到新版本，请刷新页面');
          }
          return response;
        })
        .catch(error => {
          console.error('error:', event.request.url, error);
          window.alert('检测到新版本，请刷新页面');
        })
    );
  }
});
