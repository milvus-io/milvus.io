import "@fontsource/roboto-mono";
import "@fontsource/inter";

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
