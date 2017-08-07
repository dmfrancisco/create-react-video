import { injectGlobal } from 'styled-components';

injectGlobal`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
  div {
    position: absolute;
  }
  video {
    max-width: 100%;
    width: 100%;
    height: 100%;
  }
`;
