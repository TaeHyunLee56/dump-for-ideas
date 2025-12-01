import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext();

export const useCardContext = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
    const [cardData, setCardData] = useState([

    ]);
    const [filterData, setFilterData] = useState('');

    // 카드 숨기기/표시하기
    const updateCardIsHidden = (cardId, isHidden) => {
        setCardData(prevData => 
            prevData.map(card => 
                card.id === cardId ? { ...card, isHidden } : card
            )
        );
    };

    // 카드 삭제 (isHidden을 true로 설정)
    const deleteCard = (cardId) => {
        updateCardIsHidden(cardId, true);
    };

    // 숨겨진 카드들 삭제 (휴지통 비우기)
    const deleteHiddenCards = () => {
        setCardData(prevData => prevData.filter(card => !card.isHidden));
    };

    // 카드의 6Hats 업데이트
    const updateCardHats = (cardId, updatedHats) => {
        setCardData(prevData => 
            prevData.map(card => 
                card.id === cardId 
                    ? { ...card, hats: { ...(card.hats || {}), ...updatedHats } }
                    : card
            )
        );
    };

    // 카드 추가
    const addCard = (newCard) => {
        setCardData(prevData => [...prevData, newCard]);
    };

    // 카드 수정
    const updateCard = (cardId, updatedData) => {
        setCardData(prevData => 
            prevData.map(card => 
                card.id === cardId 
                    ? { ...card, ...updatedData }
                    : card
            )
        );
    };

    return (
        <CardContext.Provider value={{ 
            cardData, 
            setCardData, 
            filterData, 
            setFilterData,
            updateCardIsHidden,
            deleteCard,
            deleteHiddenCards,
            updateCardHats,
            addCard,
            updateCard
        }}>
            {children}
        </CardContext.Provider>
    );
};

export default CardContext;