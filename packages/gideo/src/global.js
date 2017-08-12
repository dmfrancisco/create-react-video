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
    /* This fixes an issue with some text elements disappearing for larger window sizes */
    transform: scale(1);
  }
`;
