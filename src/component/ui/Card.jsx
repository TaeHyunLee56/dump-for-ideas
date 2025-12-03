import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styled from "styled-components";
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useCardContext } from '../../context/CardContext';

const Wrapper = styled.div`
    box-sizing: border-box;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: absolute; 
    border: ${(props) => (props.$isBackCard ? "2px solid transparent" : props.$isSelected ? "2px solid #424BA5" : "2px solid transparent")};
    border-radius: 14px;
    transition: border 0.1s ease-in;
    display: ${(props) => (props.$isHidden ? "none" : "block")};
    opacity: ${(props) => (props.$isBeforeHidden ? "10%" : "100%")};
    transition: opacity 0.1s ease-in;
    transform: scale(${(props) => props.scale});
    transform-origin: center center; /* 스케일의 기준점 */
    user-select: none;
    perspective: 1000px; /* 3D 효과를 위한 원근법 설정 */
    touch-action: none; /* preventDefault를 사용하기 위해 */

`;


const CardFace = styled(motion.div)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px 12px 12px 12px;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    background-color: ${props => (props.$isBack ? '#5F6471' : '#FFF')};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
`;
const CardEdit = styled.img`
    display: ${(props) => (props.$isSelected ? "block" : "none")};
    position: absolute;
    right: 8px;
    bottom: 8px;
    cursor: pointer;
    z-index: 10;
`;

// 수정 모달 스타일
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
    padding: 32px;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
`;

const ModalLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #5F6471;
    margin-bottom: 8px;
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

const ModalTextarea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #969BA4;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    min-height: 150px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    &:focus {
        border-color: #424BA5;
    }
`;

const ModalButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
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
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
`;
const CardIcon = styled.img`
    position: absolute;
    top: 8px;
    left: 8px;
`;
const CardTitle = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${props => (props.$isBack ? '#FFF' : '#333')};
`;
const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;
const CardImage = styled.div`
    width: 196px;
    height: 116px;
    background-image: url(${props => props.$image});
    background-size: cover;
    background-color: #E9ECF0;
`;
const CardText = styled.p`
    margin: 0;
    width: 100%;
    height: 115px;;
    font-size: 10px;
    font-weight: 600;
    line-height: 16px;
    color: #333;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const CardText6 = styled.p`
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    line-height: 16px;
    color: #333;
`;
const CardTap = styled.div`
    box-sizing: border-box;
    width: 196px;
    padding: 4px;
    border-radius: 999px;
    background-color: #333;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2px;
`;
const tabColors = {
    '정보': '#969BA4',
    '감정': '#E76565',
    '이점': '#FFC225',
    '위험': '#5F6471',
    '창의': '#6DB05C',
    '정리': '#5399EA'
};
const ToolTip = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    top: -44px;
`;
const ToolTipText = styled.p`
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    padding: 10px 24px;
    background-color: #5F6471;
    border-radius: 4px;
    margin-bottom: -2px;
`;
const Tri = styled.div`
    margin-left: 12px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent; /* 왼쪽 변 */
    border-right: 10px solid transparent; /* 오른쪽 변 */
    border-top: 6px solid #5F6471; /* 밑변 */
`;

// Card component
function Card({ card, cardId, type, onCardClick, isBackCard, isClickCard, isSelected , index, image, selectedCardIndex, onBoxStateChange, cardSize }) {
    const { updateCardIsHidden, updateCard } = useCardContext();


    // 6hats card tab button state management
    const [activeTab, setActiveTab] = useState('정보');
    // 6hats tab button
    const handleTabClick = (tab, event) => {
        event.stopPropagation(); // Prevent event bubbling
        setActiveTab(tab);
    };
    // Enable touch on 6hats tab button even with draggable
    const handleTapTouchStart = (tab, e) => {
        handleTabClick(tab, e);
    }
    // Expand touch area to tab container to increase touch area
    const handleTabContainerClick = (event) => {
        event.stopPropagation(); // Prevent event bubbling
    }
    

    const [size, setSize] = useState({ width: 224, height: 300 });


    // draggable initial position: center of screen
    const [position, setPosition] = useState({ x: window.innerWidth/2 - size.width/2, y: window.innerHeight/2 - size.height/2 });
    // State that indicates drag status
    const [isDragging, setIsDragging] = useState(false); 
    // Card discard status
    const [isHidden, setIsHidden] = useState(false); 
    const [isBeforeHidden, setIsBeforeHidden] = useState(false); 


    const handleOnDrag = (e, data) => {
        setIsDragging(true);

        const { x, y } = data;

        const min_x = (window.innerWidth / 2) - 110; //동그라미 반값
        const max_x = min_x + 220; //동그라미 지름
        const min_y = window.innerHeight - size.height; //카드 높이 뺌
        const max_y = window.innerHeight;

        if( x >= min_x - size.width && x <= max_x && y >= min_y && y<= max_y){
            onBoxStateChange(true);
            setIsBeforeHidden(true);

        }else{
            onBoxStateChange(false);
            setIsBeforeHidden(false);
        }
        setPosition({ x, y });
    };
    
    const handleStopDrag = (e, data) => {
        setTimeout(() => {
            setIsDragging(false);
        }, 100); // Set drag state to false 100ms after drop

        const { x, y } = data;

        const min_x = (window.innerWidth / 2) - 110; // Half of circle
        const max_x = min_x + 220; // Circle diameter
        const min_y = window.innerHeight - size.height; // Subtract card height
        const max_y = window.innerHeight;

        if( x >= min_x - size.width && x <= max_x && y >= min_y && y<= max_y){
            // console.log('Located in between');
            // console.log(`Card index located in between: ${index}`);

            setIsHidden(true); // Hide card
            onBoxStateChange(false); // Card deck comes up

            // Update card hidden state through CardContext
            updateCardIsHidden(cardId, true);
        }
    };

    const handleClick = (e) => {
        if (isDragging) return; // Don't execute function if dragging
        e.stopPropagation(); // Prevent event bubbling
        if (e.cancelable) {
            e.preventDefault(); // Prevent default behavior only if cancelable
        }
        
        onCardClick();
        // console.log('card is clicked')
        // setIsBack(!isBack);
    };

    const handleTouchStart = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (e.cancelable) {
            e.preventDefault(); // Prevent default behavior only if cancelable
        }
        handleClick(e);
    }

    const [scale, setScale] = useState(cardSize); // Manage scale value
    // console.log('Card size: ' + cardSize)

    useEffect(()=>{
        setScale(cardSize)
    },[cardSize])

    const handleResize = (e, { size }) => {
        setSize(size);
      };

    const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });

    // Update bounds according to window size
    useEffect(() => {
        const updateBounds = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        setBounds({
            left: 0,
            top: 0,
            right: windowWidth - size.width,
            bottom: windowHeight - size.height/2
        });
        };

        // Update bounds on page load and resize
        updateBounds();
        window.addEventListener('resize', updateBounds);

        // Remove event listener when component unmounts
        return () => {
        window.removeEventListener('resize', updateBounds);
        };
    }, [size.width, size.height]);

    const [isToolTipIdea, setIsToolTipIdea] = useState(false);
    const [isToolTipInsight, setIsToolTipInsight] = useState(false);
    // const [isToolTipScamepr, setIsToolTipScamper] = useState(false);
    const [isToolTip6Hats, setIsToolTip6Hats] = useState(false);

    const handleToolTip = (e) => {
        e.stopPropagation();
        // console.log('Tooltip clicked')
        if(card.type === 'idea'){
            setIsToolTipIdea(!isToolTipIdea)
            setIsToolTip6Hats(false);
            autoCloseToolTip(setIsToolTipIdea);
        } else if(card.type === 'insight'){
            setIsToolTipInsight(!isToolTipInsight)
            setIsToolTip6Hats(false);
            autoCloseToolTip(setIsToolTipInsight);
        }
    }

    const handleToolTip6Hats = (e) => {
        setIsToolTip6Hats(!isToolTip6Hats)
        setIsToolTipIdea(false);
        setIsToolTipInsight(false);
        autoCloseToolTip(setIsToolTip6Hats);
    }

    // Function to automatically close tooltip after 3 seconds
    const autoCloseToolTip = (setToolTipState) => {
        setTimeout(() => {
            setToolTipState(false);
        }, 2000); // 3000ms = 3 seconds
    };

    // Card edit modal related states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editContent, setEditContent] = useState(card.content);

    // Edit button click handler
    const handleEditClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setEditTitle(card.title);
        setEditContent(card.content);
        setIsEditModalOpen(true);
    };

    // Save edit handler
    const handleSaveEdit = (e) => {
        e.stopPropagation();
        updateCard(cardId, {
            title: editTitle,
            content: editContent
        });
        setIsEditModalOpen(false);
    };

    // Cancel edit handler
    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setIsEditModalOpen(false);
        setEditTitle(card.title);
        setEditContent(card.content);
    };



    return (
        <>
        <Draggable
            // ref={cardRef}
            position={position}
            onDrag={(e, data) => handleOnDrag(e, data)} // 드래그 시 실행되는 부분
            onStop={(e, data) => handleStopDrag(e, data)} // 드롭 시 실행되는 부분
            // onDrag={handleDrag}
            // scale={0.3}
            // bounds="parent" 
            handle=".drag" // 특정 클래스만 드래그 가능
            bounds={bounds}
        >
            <div className={`card card-${index}`}>

                <Resizable
                    width={size.width}
                    height={size.height}
                    onResize={handleResize}
                >

                    <Wrapper 
                        onClick={handleClick}
                        onTouchStart={handleTouchStart}
                        $isSelected={isSelected} 
                        $isBackCard={isBackCard}
                        // onTouchEnd={handleTouchEnd}
                        // isHidden={card.isHidden}
                        $isHidden={isHidden}
                        $isBeforeHidden={isBeforeHidden}
                        // zIndex={zIndex}

                        width={size.width}
                        height={size.height}
                        scale={scale}
                        className="drag"
                    >

                        {isToolTipIdea && (
                            <ToolTip>
                                <ToolTipText>This is your own idea.</ToolTipText>
                                <Tri></Tri>
                            </ToolTip>)}
                        {isToolTipInsight && (
                        <ToolTip>
                            <ToolTipText>This is an AI-generated idea.</ToolTipText>
                            <Tri></Tri>
                        </ToolTip>)}
                        {isToolTip6Hats && (
                        <ToolTip>
                            <ToolTipText>Reviewed with 6 Hats method.</ToolTipText>
                            <Tri></Tri>
                        </ToolTip>)}

                        <AnimatePresence initial={false}>

                            {!isBackCard && (
                                <CardFace
                                    key="front"
                                    initial={{ rotateY: 180 }}
                                    animate={{ rotateY: 0 }}
                                    exit={{ rotateY: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <CardIcon 
                                        onTouchStart={(e)=>handleToolTip(e)} 
                                        src={"/card_type=" + card.type + ".png"} width="24px" />
                                    <CardTitle>{card.title}</CardTitle>
                                    <CardContent>
                                        <CardImage $image={card.imageUrl || card.imagePath || ''}/>
                                        {/* <CardTag /> */}
                                        <CardText>{card.content}</CardText>
                                    </CardContent>

                                    <CardEdit 
                                        $isSelected={isSelected} 
                                        src="/edit.png" 
                                        width="32px"
                                        onClick={handleEditClick}
                                        onTouchStart={handleEditClick}
                                    />
                                </CardFace>
                            )}
                            {isBackCard && (
                                <CardFace
                                    key="back"
                                    initial={{ rotateY: -180 }}
                                    animate={{ rotateY: 0 }}
                                    exit={{ rotateY: 0 }}
                                    transition={{ duration: 0.6 }}
                                    $isBack={true}
                                >
                                    <CardIcon
                                        onTouchStart={(e)=>handleToolTip6Hats(e)} 
                                        src="/card_type=6hats.png" width="24px"
                                    />
                                    <CardTitle $isBack={true}>6HATS</CardTitle>
                                    <CardTap onClick={(event)=>handleTabContainerClick(event)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
                                        {Object.keys(tabColors).map(tab => (
                                            <div
                                                key={tab}
                                                style={{
                                                    margin: 0,
                                                    padding: '4px 6px',
                                                    borderRadius: '999px',
                                                    backgroundColor: activeTab === tab ? tabColors[tab] : 'transparent',
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    color: '#FFF',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(event) => handleTabClick(tab, event)}
                                                onTouchStart={(e) => handleTapTouchStart(tab,e)}
                                            >
                                                {tab}
                                            </div>
                                        ))}
                                    </CardTap>
                                    <CardText6>
                                        {card.hats && card.hats[activeTab] ? card.hats[activeTab] : 'No review content available.'}
                                    </CardText6>
                                </CardFace>
                            )}
                        </AnimatePresence>
                    </Wrapper>
                </Resizable>
            </div>
        </Draggable>

        {/* Edit modal */}
        {isEditModalOpen && (
            <ModalOverlay onClick={handleCancelEdit}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>Edit Card</ModalTitle>
                    
                    <InputGroup>
                        <ModalLabel>Title</ModalLabel>
                        <ModalInput
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Enter card title"
                        />
                    </InputGroup>

                    <InputGroup>
                        <ModalLabel>Content</ModalLabel>
                        <ModalTextarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Enter card content"
                        />
                    </InputGroup>

                    <ModalButtonContainer>
                        <ModalButton onClick={handleCancelEdit}>
                            Cancel
                        </ModalButton>
                        <ModalButton $primary onClick={handleSaveEdit}>
                            Save
                        </ModalButton>
                    </ModalButtonContainer>
                </ModalContent>
            </ModalOverlay>
        )}
    </>
    );
}

export default Card;

