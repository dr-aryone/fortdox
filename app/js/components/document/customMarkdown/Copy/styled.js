const styled = require('styled-components').default;
module.exports = {
  Wrapper: styled.span`
    margin: 0 5px;
    display: inline-block;
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  `,
  Input: styled.input`
    padding-left: 10px;
    border: none;
    background: transparent;
    margin: 0;
  `,
  Button: styled.button`
    height: 100%;
    background: hsl(0, 9%, 96%);
    fill: hsla(0, 0%, 35%, 1);
    box-shadow: none;
    &:hover,
    &:active {
      background: hsl(195, 50%, 96%);
      fill: hsla(0, 0%, 15%, 1);      
    }
    &:focus {
      background: hsl(0, 9%, 96%);
      fill: hsla(0, 0%, 35%, 1);
    }
  `
};