import { createGlobalStyle } from "styled-components";
import font from "./fonts/ggsans-Normal.ttf";
import fonta from "./fonts/ggsans-Semibold.ttf";
import fontaa from "./fonts/ggsans-Medium.ttf";
import areal from "./fonts/arial.ttf";

import WebFont from "webfontloader";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'arial';
    src: url(${areal}) format('truetype');
    font-weight: normal;
  font-style: normal;
  }
  @font-face {
    font-family: 'UniSans';
    src: url(${font}) format('truetype');
    font-weight: normal;
  font-style: normal;
  }
  @font-face {
    font-family: 'UniSans';
    src: url(${fontaa}) format('truetype');
    font-weight: medium;
  font-style: normal;
  }
  @font-face {
    font-family: 'UniSans';
    src: url(${fonta}) format('truetype');
    font-weight: bold;
  font-style: normal;
  }
 
  *{
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;900&family=Poppins:wght@300;400;600;700;800;900&family=Roboto:wght@400;500;700&display=swap');

    margin-block-start: 0em;
  margin-block-end: 0em;
  font-weight:400;
  box-sizing: border-box;
  font-family: 'UniSans', sans-serif;
  letter-spacing: .1px;
  ::-webkit-scrollbar {
  width: 7px;
  height: 2px;
}

/* Track */
::-webkit-scrollbar-track {
   background: #2b2d31;
   height: 2px;
   
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #2b2d31;
  height: 2px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
   background: #1e1f22;
   border-radius: .5rem;
   height: 2px;

}
 }
/* 
 body::-webkit-scrollbar{
  width: .6rem;
 }
 body::-webkit-scrollbar-track{
   background: hsla(0, 0%, 0%, 0.42) ;
    border-radius: 100vw;
 }
 body::-webkit-scrollbar-thumb{
  
   background: hsla(0, 0%, 0%, 0.60) ;
   border: .1rem solid hsla(0, 0%, 0%, 0.42);
   border-radius: 100vw;

 }
 @supports (scrollbar-color: red blue){
  *{
    scrollbar-color: hsla(0, 0%, 0%, 0.42) hsla(0, 0%, 0%, 0.60);
    scrollbar-width: thin;

  }
 } */
  body {
   
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'UniSans', sans-serif;
    .active{
      background-color: blue;
    }
    }

    
`;

export default GlobalStyle;
