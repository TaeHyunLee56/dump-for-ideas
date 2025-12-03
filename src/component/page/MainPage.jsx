import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Lottie from 'lottie-react';
import animationData from '../../lotties/logo.json';

const gradientAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const Wrapper = styled.div`
    background: linear-gradient(-45deg,rgb(181, 186, 201),rgb(181, 191, 205), #F4F5F7, #e5e7eb, #d9dce3);
    background-size: 400% 400%;
    animation: ${gradientAnimation} 8s ease infinite;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    position: relative;
`;
const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    margin-bottom: 120px;
`;
const Button = styled.div`
    width: fit-content;
    padding: 12px 40px;
    background-color: #E6584A;
    border-radius: 999px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all ease-in-out 0.2s;
    transform: translateY(0px);
    box-shadow: 0 4px 12px rgba(230, 88, 74, 0.3);
    &:hover {
        background-color: #d44a3d;
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(230, 88, 74, 0.4);
    }
`;
const Copyright = styled.p`
    position: absolute;
    bottom: 40px;
    font-size: 12px;
    font-weight: 400;
    color: #969BA4;
    text-align: center;
`;



function MainPage(props){
    const navigate = useNavigate();


    return(
        <Wrapper>
                <Title>
                    <Lottie animationData={animationData} loop={true} style={{ width: 800, height: 200 }} />
                    <Button onClick={() => navigate('/canvas')}>Start</Button>
                </Title>

            <Copyright>
                Ⓒ 2024 Taehyun Lee
            </Copyright>
        </Wrapper>
    );
}

export default MainPage;

