import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { useCardContext } from '../../context/CardContext';

const Wrapper = styled(motion.div)`
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;

    position: fixed;
    bottom: 120px;
    left: calc(50% - 140px);
    z-index: 9999;
`;
const StyledInput = styled.div`
    width: 280px;
    height: 72px;
    padding: 24px;
    border-radius: 36px;
    border: none;
    background-color: #424BA5;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    &::placeholder {
        color: #B3B7DB;
        // text-decoration: underline; /* 밑줄 추가 */
    };
    &:focus {
        outline: none;
    };

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Tri = styled.div`
    width: 0;
    height: 0;
    border-left: 16px solid transparent; /* 왼쪽 변 */
    border-right: 16px solid transparent; /* 오른쪽 변 */
    border-top: 20px solid #424BA5; /* 밑변 */
`;

const TagItem = styled.div`
    width: 100%;
    margin: 4px;
    padding: 4px;
    border-radius: 4px;
    // background-color: #424BA5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 16px;
    color: white;
`;

const Text = styled.span``;

const TagInput = styled.input`
    width: 100%;
    // margin-left: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    cursor: text;
    background-color: #424BA5;
    text-align: center;
    display: ${props => (props.tagInput ? 'none' : 'block')};
    color: #fff;
    &::placeholder {
        color: #B3B7DB;
    }
`;
const DeleteTag = styled.img`
    position: absolute;
    right: 24px;
`;



function Filter(props) {
    const { filterData, setFilterData } = useCardContext();

    const [isEditing, setIsEditing] = useState(false); // Title editing state management
  
    useEffect(() => {
        setFilterData(filterData || '');
        if(filterData === ""){
            setIsEditing(true)
        }
    }, [filterData, setFilterData]);


    const handleFilter = (e) => {
        e.stopPropagation();
    };

    const handleDeleteClick = (e) => {
        setIsEditing(true);
        setFilterData('');
        e.stopPropagation();
    };

    const handleInputChange = (e) => {
        setFilterData(e.target.value);
        console.log('태그아이템: ' + filterData)
    };

    const handleInputBlur = async () => {
        if(filterData !== ""){
            setIsEditing(false);
        } else {
            setFilterData(filterData)
        }
    };

    console.log('이 캔버스의 필터값: ' + filterData);

    return (
        <Wrapper
            initial={{ opacity: 0, y: 30, scale: 0.5 }}  // 아래쪽(50px)에서 시작, 투명 상태
            animate={{ opacity: 1, y: 0, scale: 1  }}   // 위로 올라오며 y값 0으로 애니메이션, 불투명
            transition={{ type: 'spring', stiffness: 50, duration: 0.3, delay: 0.1 }}  // spring 타입 애니메이션 설정
        >
            <StyledInput>
                {isEditing ? (
                    <TagInput
                        type="text"
                        value={filterData}
                        onChange={handleInputChange}
                        onClick={handleFilter}
                        onBlur={handleInputBlur}
                        // autoFocus
                        placeholder="어떤 아이디어를 가져올까요?"
                    />
                ) : (
                    <TagItem>
                        <Text>{filterData}</Text>
                        <DeleteTag
                            onClick={handleDeleteClick}
                            src="/icon/close.png"
                            width="16px"
                        />
                    </TagItem>
                )}
            </StyledInput>
            <Tri></Tri>
        </Wrapper>
    );
};



export default Filter;