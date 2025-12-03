import React, { useRef } from "react";

import styled from "styled-components";
import { useCardContext } from '../../context/CardContext';



const Wrapper = styled.div`
    box-sizing: border-box;
    width: 275px;
    height: 370px;
    padding: 20px 15px 15px 15px;
    border-radius: 15px; 
    background-color: #FFF;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
    // border: 3px solid #424BA5;
    border: ${(props) => (props.isSelected ? "3px solid #424BA5" : "3px solid transparent")};
    position: relative;

    display: ${(props) => (props.isHidden ? "none" : "flex")};

`;
const CardIcon = styled.img`
    position: absolute;
    top: 10px;
    left: 10px;
`;
const CardTitle = styled.p`
    margin: 0;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    text-align: center;
`;
const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const CardImage = styled.div`
    width: 245px;
    height: 145px;
    background-image: url(${props => props.image});
    background-size: cover;
    background-color: #E9ECF0;
`;
const CardText = styled.p`
    margin: 0;
    width: 100%;
    // height: 114px;
    height: 144px;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    color: #333;
    overflow: scroll;
    &::-webkit-scrollbar{
        display:none;
    }
`;


const CardDelete = styled.img`
    display: ${(props) => (props.isSelected ? "block" : "none")};
    position: absolute;
    top: -10px;
    right: -10px;
    // transition: display 0.2s ease-in;

`;


function Card2(props){

    const { deleteCard } = useCardContext();
    const { card, onCardClick, isSelected, cardId } = props;
    const cardRef = useRef(null);
    // const [border, setBorder] = useState(0); //scamper,6hats 버튼 활성화
    // const [isSelect, setIsSelect] = useState(isSelected);

    // useEffect(() => {
    //     console.log(isSelect)
    // }, [isSelected]);
    
    // const onClickItem = (e) => {
    //     e.stopPropagation(); // 이벤트 버블링을 막음?
    //     setIsCardClick(true); // 로컬 상태를 업데이트
    //     onCardClick(); // 부모 컴포넌트의 함수를 호출
    // };

    const handleClick = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        onCardClick();
        // console.log('card is clicked')
        // setIsBack(!isBack);

    };

    const handleTouchStart = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        handleClick(e);
    };

    // onCardClick(index);

    const handleDeleteCard = (e) => {
        e.stopPropagation();
        // console.log('delete card')
        deleteCard(cardId);
    };

    const handleDeleteTouch = (e) => {
        e.stopPropagation();
        handleDeleteCard(e);
    };

    return (
        <Wrapper
            ref={cardRef} 
            // onClick={handleClick}
            isHidden={card.isHidden}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            isSelected={isSelected} 
        >
            <CardIcon src={"/card_type=" + card.type + ".png"} width="30px"/>
            <CardTitle>{card.title}</CardTitle>
            <CardContent>
                <CardImage image={card.imageUrl || card.imagePath || ''}/>
                <CardText>{card.content}</CardText>
            </CardContent>

            <CardDelete onClick={handleDeleteCard} onTouchStart={handleDeleteTouch} isSelected={isSelected} src="/delete.png" width="40px" />
        </Wrapper>
    )
}

export default Card2;