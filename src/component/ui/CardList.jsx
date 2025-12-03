import React, { useState } from "react";
import styled from "styled-components";
import { useCardContext } from '../../context/CardContext';
import Card2 from "./Card2";
import Card2S from "./Card2S";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #F4F5F7;
    &::-webkit-scrollbar {
        display: none;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    overflow: scroll;
    position: relative;
`;

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 275px); /* Three columns of 275px each */
    grid-template-rows: repeat(2, 370px); /* Two rows of 370px each */
    gap: 40px;
    justify-content: center; /* Center the grid horizontally */
    align-content: center; /* Center the grid vertically */
    position: absolute;
    top: 132px;
    padding-bottom: 120px;
`;

const LoadCardText = styled.p`
    font-size: 18px;
    font-weight: 600;
    color: #5F6471;
`;

function CardList() {
    const { cardData } = useCardContext();

    const [selectedCardIndex, setSelectedCardIndex] = useState(null);

    const onCardCard = (index) => {
        setSelectedCardIndex(index);
    };

    const renderCard = (card, index) => {
        switch (card.type) {
            case 'idea':
                return (
                    <Card2
                        key={card.id || index}
                        index={index}
                        onCardClick={() => onCardCard(index)}
                        card={card}
                        cardId={card.id}
                        isSelected={selectedCardIndex === index}
                    />
                );
            case 'insight':
                return (
                    <Card2
                        key={card.id || index}
                        index={index}
                        onCardClick={() => onCardCard(index)}
                        card={card}
                        cardId={card.id}
                        isSelected={selectedCardIndex === index}
                    />
                );
            case 'scamper':
                return (
                    <Card2S
                        key={card.id || index}
                        index={index}
                        onCardClick={() => onCardCard(index)}
                        card={card}
                        cardId={card.id}
                        isSelected={selectedCardIndex === index}
                    />
                );
            default:
                return (
                    <div key={index}>Unknown card type</div>
                );
        }
    };

    return(
        <Wrapper>
            {cardData.length === 0 ? (
                    <LoadCardText>No cards yet. Create your first card!</LoadCardText>
            ) : (
                <CardsGrid>
                    {cardData.map((card, index) => renderCard(card, index))}
                </CardsGrid>
            )}
        </Wrapper>
    );
};

export default CardList;