import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Lottie from 'react-lottie';
import * as animationData from '../../lotties/logo.json';

const Wrapper = styled.div`
    width: 100vw;
    min-height: 100vh;
`;
const Container = styled.div`
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px 40px 40px;
    gap: 24px;
`;
const MainTitle = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: #666;
`;
const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
`;
const FeaturesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 60px;
`;
const FeatureItem = styled.div`
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;
const FeatureTitle = styled.p`
    font-size: 16px;
    font-weight: 600;
    color: #333;
`;
const FeatureDescription = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: #666;
    text-align: center;
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
    padding: 40px 0 ;
    font-size: 12px;
    font-weight: 400;
    color: #969BA4;
    text-align: center;
`;



function MainPage(props){
    const navigate = useNavigate();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet'
        }
    };

    return(
        <Wrapper>
            <Container>
                <Title>
                    <Lottie options={defaultOptions} width={800} height={200}/>
                    <Button onClick={() => navigate('/canvas')}>Start</Button>
                </Title>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '60px' }}>
                    <MainTitle>AI-Powered Idea Brainstorming using Cards</MainTitle>
                    <FeaturesContainer>
                        <FeatureItem>
                            <FeatureTitle>Generate New Insights</FeatureTitle>
                            <FeatureDescription>
                                Draw new 'Insight' cards based on your past ideas, <br/>including those you've dumped.
                            </FeatureDescription>
                        </FeatureItem>
                        <FeatureItem>
                            <FeatureTitle>Expand & Review Ideas</FeatureTitle>
                            <FeatureDescription>
                                Develop your ideas using the Scamper Technique <br/> and critically review them with the 6 Hats Method.
                            </FeatureDescription>
                        </FeatureItem>
                    </FeaturesContainer>
                </div>


            </Container>


            <Copyright>
                Ⓒ 2024 by Taehyun Lee<br/>last updated: 2025.12.02
            </Copyright>
        </Wrapper>
    );
}

export default MainPage;

