import React from "react";
import { useNavigate } from "react-router-dom";
import { useCardContext } from '../../context/CardContext';

import styled from "styled-components";

const Wrapper = styled.div`
    width: 100vw;
    height: 80px;
    padding: 0px 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 1000;
    user-select: none;
`;
const HeadTitleContainer = styled.div`
    width: 400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const ToggleContainer = styled.div`
    width: 60px;
    height: 32px;
    border-radius: 999px;
    background-color: #407671;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
`;
const ToggleBtn = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background-color: #FFF;
    position: absolute;
    left: ${props => (props.toggled ? 'calc(100% - 30px)' : '2px')}; /* 상태에 따라 위치 변경 */
    transition: left 0.3s;
`;
const ToggleCanvas = styled.img`
    position: absolute;
    left: 2px;
`;
const ToggleList = styled.img`
    position: absolute;
    right: 2px;
`;
const HeadIconContainer = styled.div`
    width: 400px;
    display: flex;
    justify-content: flex-end;
`;

const EditCanvasContent = styled.div`
    font-size: 14px;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    color: #666;
    background-color: #E9ECF0;
    border-radius: 8px;
    transition: all 0.2s;
    &:hover {
        background-color: #D4D8E0;
    }
`;

function Header(props){

    const navigate = useNavigate();
    const { deleteHiddenCards } = useCardContext(); 


    const { toggled, onToggle  } = props;
    
    const navigateToAddCard = () => {
        navigate(`/canvas/addcard`);
    };



    const handleDeleteHiddenCards = () => { // Empty trash
        deleteHiddenCards();
        alert('Trash has been emptied');
      };
      

    return (
        <Wrapper>
            <HeadTitleContainer>
                <img onClick={()=>{navigate('/')}} src={"/icon/back.png"} width="32px" alt="back"/>
                <EditCanvasContent onClick={handleDeleteHiddenCards}>
                    Empty Trash
                </EditCanvasContent>
            </HeadTitleContainer>
            
            <ToggleContainer onClick={onToggle}>
                <ToggleBtn toggled={toggled}></ToggleBtn>
                <ToggleCanvas
                    src={`/toggleCanvas=${toggled ? "inactive" : "active"}.png`}
                    width="28px"
                    alt="toggleCanvas"
                />
                <ToggleList
                    src={`/toggleList=${toggled ? "active" : "inactive"}.png`}
                    width="28px"
                    alt="toggleList"
                />
            </ToggleContainer>

            <HeadIconContainer>
                <img onClick={navigateToAddCard} src={"/icon/addCard.png"} width="32px" alt="addCard"/>
            </HeadIconContainer>
        </Wrapper>
    );
}

export default Header;