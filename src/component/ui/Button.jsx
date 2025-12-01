import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const StyledButton = styled(motion.div)`
    padding: ${({ disabled }) => (disabled ? '10px 18px' : '12px 20px')};
    //패딩이 바깥쪽으로 적용되어서 크기 변경되는 것 방지
    // padding: 12px 20px;
    border-radius: 999px;
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#424BA5')};
    border: ${({ disabled }) => (disabled ? '2px solid #424BA5' : 'transparent')};
    font-size: 18px;
    font-weight: 600;
    color: ${({ disabled }) => (disabled ? '#424BA5' : '#fff')};
    position: absolute;
    right: 40px;
    bottom: 40px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
`;
//왜 motion 적용 안됨?
function Button(props){
    const {onClick, disabled} = props;
    return(
        <StyledButton 
                whileTap={!disabled && { scale: 0.8 }} 
                onClick={onClick} 
                disabled={disabled}
        >Save</StyledButton>
    )
}

export default Button;