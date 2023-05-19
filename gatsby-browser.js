import './src/css/variables.css';
import './src/css/reset.css';
import './src/css/global.css';
import './src/css/grid.less';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/source-code-pro/400.css';
import '@fontsource/source-code-pro/500.css';
import '@fontsource/source-code-pro/600.css';
import '@fontsource/source-code-pro/700.css';

import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/600.css';
import '@fontsource/roboto-mono/700.css';

let nextRoute = '';

export const onPreRouteUpdate = ({ location }) => {
  nextRoute = location.pathname;
};

window.addEventListener('unhandledrejection', event => {
  if (/loading chunk \d* failed./i.test(event.reason)) {
    if (nextRoute) {
      window.location.pathname = nextRoute;
    }
  }
});
