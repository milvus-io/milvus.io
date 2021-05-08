import { useEffect } from 'react';

/**
 * connect to local enterprise manager
 * example:
 * <code>asdasd</code>

<div class="query-button-panel">
<span class="copy">copy</span>
<span class="console">console</span>
<span class="setting">setting</span>

</div>
 * 
 */
export const useEmPanel = setShowModal => {
  const getRequestAsCURL = code => {
    const [header, ...data] = code.split('\n');
    const [method, url] = header.split(' ');
    const queryBody = data.join('\n');

    return `curl -X ${method} "http://localhost:8000${url}" -H 'Content-Type: application/json' -d'\n${queryBody}'`;
  };

  const copyToClipboard = content => {
    const el = document.createElement(`textarea`);
    el.value = content;
    el.setAttribute(`readonly`, ``);
    el.style.position = `absolute`;
    el.style.left = `-9999px`;
    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
  };

  const handleCopy = code => {
    copyToClipboard(code);
  };

  const handleOpenConsole = () => {
    console.log('open console');
  };

  const handleSetting = () => setShowModal(true);

  useEffect(() => {
    document.querySelectorAll('.query-button-panel').forEach(panel => {
      const codeWrapper = panel.previousElementSibling;
      codeWrapper.classList.add('query-button-code');

      const querySnippet = codeWrapper.querySelector('code').textContent;
      const formatCode = getRequestAsCURL(querySnippet);

      panel.addEventListener('click', e => {
        const funcMap = {
          copy: handleCopy,
          console: handleOpenConsole,
          // setting wrapper
          setting: handleSetting,
          // setting icon
          'fa-cog': handleSetting,
        };

        const classList = e.target.classList;

        Object.keys(funcMap).forEach(key => {
          if (classList.contains(key)) {
            funcMap[key](formatCode);
          }
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
