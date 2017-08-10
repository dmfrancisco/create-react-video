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
  }
  div {
    position: absolute;

    /* This fixes an issue with some text elements disappearing for larger window sizes */
    transform: scale(1);
  }
  video {
    max-width: 100%;
    width: 100%;
    height: 100%;
  }
`;
