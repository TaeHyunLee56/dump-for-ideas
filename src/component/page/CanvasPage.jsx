import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { ApiKeyContext } from '../../context';
import Header from "../ui/Header";
import Canvas from "../ui/Canvas";
import CardList from "../ui/CardList";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #F4F5F7;
    overflow: hidden;
    touch-action: none;
`;
const Coach = styled.img`
    z-index: 2000;
    position: absolute;
    right: 24px;
    bottom: 24px;
`;
const CoachPage = styled.div`
    position: absolute;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
`;
const ToggleContainer = styled.div`
    width: 60px;
    height: 32px;
    border-radius: 999px;
    background-color: #333333;
    display: flex;
    align-items: center;
    position: relative;
    top: 24px;
    left: calc(50vw - 30px);
    z-index: 2000;
`;
const ToggleBtn = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background-color: #FFF;
    position: absolute;
    left: 2px;
`;
const ToggleCanvas = styled.img`
    position: absolute;
    left: 2px;
`;
const ToggleList = styled.img`
    position: absolute;
    right: 2px;
`;
const AddContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: fixed;
    top: calc(50% - 58px);
    left: 40px;
    z-index: 2000;
    transition: all 0.1s ease-in;
`;
const AddScamper = styled.img`
`;
const Add6hats = styled.img`
`;
const BoxCard = styled.div`
    width: 148px;
    height: 200px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    position: fixed;
    left: calc(50% - 74px);
    bottom: -100px;
`;
const BoxCard2 = styled(BoxCard)`
    transform: rotate(15deg) translateX(30px) translateY(16px);
`;
const BoxCard3 = styled(BoxCard)`
    transform: rotate(-15deg) translateX(-30px) translateY(16px);
`;
const HeadIcon = styled.img`
    position: absolute;
    right: 40px;
    top: 24px;
`;
const CoachInfo1 = styled.img`
    position: absolute;
    top: calc(50vh - 47px);
    left: 100px;
`;
const CoachInfo2 = styled.img`
    position: absolute;
    top: 64px;
    left: calc(50% - 320px);
`;
const CoachInfo3 = styled.img`
    position: absolute;
    top: 72px;
    right: 50px;
`;
const CoachInfo4 = styled.img`
    position: absolute;
    bottom: 80px;
    left: calc(50% - 40px);
`;
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;
const ModalContent = styled.div`
    background-color: #fff;
    padding: 40px;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 24px;
`;
const ModalTitle = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;
const ModalInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #969BA4;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: #424BA5;
    }
`;
const ModalButton = styled.button`
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    ${props => props.$primary ? `
        background-color: #424BA5;
        color: #fff;
        &:hover {
            background-color: #353a8a;
        }
    ` : `
        background-color: #E9ECF0;
        color: #5F6471;
        &:hover {
            background-color: #d4d8e0;
        }
    `}
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

function CanvasPage(props) {
    const { apiKey, setApiKey, apiKeyError, setApiKeyError } = useContext(ApiKeyContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputApiKey, setInputApiKey] = useState(apiKey || '');
    const [toggled, setToggled] = useState(false);

    const handleToggle = () => {
        setToggled(prevState => !prevState);
    };

    const [isCoach, setIsCoach] = useState(false);
    const handleCoach = () => {
        setIsCoach(!isCoach);
    };

    useEffect(() => {
        if (!apiKey || apiKeyError) {
            setIsModalOpen(true);
            if (apiKeyError) {
                setInputApiKey(''); // 에러 발생 시 입력 필드 초기화
            }
        }
    }, [apiKey, apiKeyError]);

    const handleSaveApiKey = () => {
        if (inputApiKey.trim()) {
            setApiKey(inputApiKey.trim());
            setApiKeyError(false); // 에러 상태 리셋
            setIsModalOpen(false);
        }
    };

    return (
            <Wrapper>
                <Header toggled={toggled} onToggle={handleToggle} canvasData={{}} canvasId={null} />
                {isCoach && (
                    <CoachPage>
                        <ToggleContainer>
                            <ToggleBtn></ToggleBtn>
                            <ToggleCanvas
                                src={"/toggleCanvas=active.png"}
                                width="28px"
                            />
                            <ToggleList
                                src={"/toggleList=inactive.png"}
                                width="28px"
                            />
                        </ToggleContainer>
                        <AddContainer>
                            <AddScamper src={"/icon/addScamperC.png"} width="48px" />
                            <Add6hats src={"/icon/add6hatsC.png"} width="48px" />
                        </AddContainer>
                        <div>
                            <BoxCard />
                            <BoxCard2 />
                            <BoxCard3 />
                        </div>
                        <HeadIcon src="/icon/addCardC.png" width="32px" />
                        <CoachInfo1 src="/coachInfo1.png" height="94px" />
                        <CoachInfo2 src="/coachInfo2.png" height="72px" />
                        <CoachInfo3 src="/coachInfo3.png" height="78px" />
                        <CoachInfo4 src="/coachInfo4.png" height="212px" />
                    </CoachPage>
                )}
                {toggled ? <CardList /> : <Canvas />}
                {!toggled && (
                    <Coach
                        onClick={handleCoach}
                        src={`/icon/${isCoach ? 'closeCoach' : 'coachMark'}.png`}
                        width="24px"
                    />
                )}

                {isModalOpen && (
                    <ModalOverlay>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <ModalTitle>{apiKeyError ? 'Please enter a valid OpenAI API key.' : 'Enter OpenAI API Key'}</ModalTitle>
                            <ModalInput
                                type="password"
                                placeholder="sk-..."
                                value={inputApiKey}
                                onChange={(e) => setInputApiKey(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && inputApiKey.trim()) {
                                        handleSaveApiKey();
                                    }
                                }}
                                autoFocus
                            />
                                <ModalButton 
                                    $primary 
                                    onClick={handleSaveApiKey}
                                    disabled={!inputApiKey.trim()}
                                >
                                    Save
                                </ModalButton>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </Wrapper>
    );
}

export default CanvasPage;