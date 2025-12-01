import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext();

export const useCardContext = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
    const [cardData, setCardData] = useState([
        { id: 1, title: "Card 1", content: "Content for Card 1", isHidden: false, type: "idea",
            hats: {
                감정: "노인들의 손글씨 부담을 덜어주고, 손쉽게 소중한 마음을 전달할 수 있어서 노인들에게는 안도감과 감사함을 느낄 수 있는 서비스이다.",
                위험: "음성 인식 기술의 한계나 오작동으로 인해 편지 내용이 정확히 전달되지 않을 수 있다. 또한 개인정보 보호에 대한 문제가 발생할 수 있다.",
                이점: "노인들의 편리한 편지 작성과 전달을 도와주어 소통을 원활하게 할 수 있으며, 손글씨 부담을 덜어주어 편안한 마음으로 소중한 메시지를 전달할 수 있다.",
                정리: "노인들을 위한 음성 기반 편지 작성 서비스는 노인들의 소중한 마음을 편리하게 전달할 수 있는 혁신적인 서비스로, 감사함과 소통을 증진시킬 수 있는 장점이 있다. 그러나 음성 인식 기술의 한계와 개인정보 보호 문제 등 위험 부분에 대한 고려가 필요하다.",
                정보: "노인들을 위한 음성 기반 편지 작성 서비스로, 편리하고 쉽게 편지를 작성하고 전달할 수 있다. 편지 작성 AI를 활용하여 음성 메모 형식으로 편지를 작성하고 녹음하여 전달할 수 있도록 제공된다.",
                창의: "노인들의 편지 작성 부담을 덜어주고, 음성 인식 기술을 활용하여 편리하게 편지를 작성하고 전달할 수 있는 혁신적인 서비스이다."
            }
         },
        { id: 2, title: "Card 2", content: "Content for Card 2", isHidden: false, type: "idea", hats: {} },
        { id: 3, title: "Card 3", content: "Content for Card 3", isHidden: false, type: "insight", hats: {} },
        { id: 4, title: "Card 4", content: "Content for Card 4", isHidden: false, type: "scamper", hats: {} }
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