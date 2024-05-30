import React from 'react'
import styled from 'styled-components'
const Top = () => {
  return (
    <Cover>
        <button>
            Find or start a conversation
        </button>
     </Cover>
  )
}

export default Top

const Cover = styled.div`
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b2d31;
    border-bottom: 2px solid #1f2023;
    button{
        width: 92%;
        height: 1.8rem;
        text-align: start;
        border: none;
        background-color: #1e1f22;
        color: #949ba4;
         font-weight: 500;
        border-radius: .2rem;
        outline: none;
        cursor: pointer;
         
    }
 `