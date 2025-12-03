import React, { useState, useEffect, useRef, useContext } from "react";

import Lottie from 'lottie-react';
import animationData from '../../lotties/loading.json';
import animationData2 from '../../lotties/card_loading2.json';
import animationData3 from '../../lotties/card_loading3.json';

import styled, { keyframes } from "styled-components";

import Filter from "../ui/Filter";
import Card from "./Card";
import CardS from "./CardS";
import { ApiKeyContext } from '../../context';  // context.js에서 가져옴
import { useCardContext } from '../../context/CardContext';

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #F4F5F7;
    overflow: hidden;
    position: relative;
`;
const AddContainer = styled.div`
    opacity: ${props => props.opacity}%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: fixed;
    top: calc(50% - 58px);
    left: 40px;
    z-index: 500;
    transition: all 0.1s ease-in;
`;
const AddScamper = styled.img`
    cursor: pointer;
    user-select: none;
`;
const Add6hats = styled.img`
    cursor: pointer;
    user-select: none;
`;
const Box2 = styled.img`
    position: fixed;
    left: calc(50% - 40px);
    bottom: ${props => (props.$boxState ? '8px' : '-80px')}; /* 상태에 따라 위치 변경 */
    transition: bottom 0.2s ease-in-out;
        z-index: 1000;
`;
const SizeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    // gap: 4px;
    position: fixed;
    right: 32px;
    top: calc(50% - 48px);
`;
const slideUp = keyframes`
    0% {
        bottom: -300px;
        opacity: 0;
        transform: scale(0.5);
    }
    100% {
        bottom: calc(50% - 150px);
        opacity: 1;
        transform: scale(1);
    }
`;
const LoadCard = styled.div`
    width: 224px;
    height: 300px;

    position: absolute;
    bottom: calc(50% - 150px);
    left: calc(50% - 112px);
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
`;
const LoadCard2 = styled(LoadCard)`
     background-color: #fff;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    animation: ${slideUp} 1s forwards;
`;
const LoadCard3 = styled(LoadCard)`
     background-color: #fff;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3
    // animation: ${slideUp} 1s forwards;
`;
const LoadCardText = styled.p`
    font-size: 18px;
    font-weight: 600;
    color: #5F6471;
`;
const BoxCard = styled.div`
    width: 148px;
    height: 200px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    position: fixed;
    left: calc(50% - 74px);
    bottom: ${(props) => props.$bottom}px;
    z-index: ${(props) => props.$zIndex};
    transform: ${(props) => props.$transform};
    transition: bottom 0.2s ease-in-out;
`;
const BoxCard2 = styled(BoxCard)`
    transform: rotate(15deg) translateX(30px) translateY(16px);
`;
const BoxCard3 = styled(BoxCard)`
    transform: rotate(-15deg) translateX(-30px) translateY(16px);
`;

function Canvas(props) {
    const { apiKey, setApiKeyError } = useContext(ApiKeyContext);
    const { cardData, filterData, updateCardHats, addCard } = useCardContext();

    const [hiddenTitles, setHiddenTitles] = useState([]);   // Titles of discarded cards
    const [prompt, setPrompt] = useState('');               // Insight generation prompt

    const [cardLoading, setCardLoading] = useState(false);

    useEffect(() => {
        setCardLoading(true); // 데이터 로딩 시작

        // Fetch card data directly from CardContext
        try {
            const tempHiddenContents = cardData
                .filter(card => card.isHidden)
                .map(card => card.content);
            setHiddenTitles(tempHiddenContents);
        } catch (error) {
            console.error("Error processing card data: ", error);
        } finally {
            setCardLoading(false); // 로딩 상태 비활성화
        }
    }, [cardData]);

    useEffect(() => {
        setHiddenTitles(cardData.filter(card => card.isHidden).map(card => card.content));
    }, [cardData]);

useEffect(() => {
    const hiddenContentsString = hiddenTitles.join(', ');
    // console.log(hiddenContentsString)
    const newPrompt = `
        <참고데이터> 내용 전체 혹은 일부를 참고하여, 제품 및 서비스 아이디어를 <요구사항>에 맞게 1개 만든 후, 구체적인 내용을 <출력형식>에 맞춰 출력한다.
        <요구사항>
        ${filterData ? `- 이 아이디어의 핵심은 '${filterData}'다.` : ''}
        - 제목은 어떤 아이디어인지 직관적으로 알 수 있으며 중복되지 않게 띄어쓰기 포함 8글자 이내로 짓는다.
        - 내용은 아이디어의 핵심적인 내용을 설명한다.
        - 참고데이터 내용을 끝까지 확인 후 참고한다.
        <참고데이터> '${hiddenContentsString ? hiddenContentsString : '참고데이터가 없으므로 자유롭게 아이디어를 생성한다.'}'
        <출력형식> '- 제목: - 내용: '
    `;

    setPrompt(newPrompt);

    // console.log(newPrompt)

}, [filterData, hiddenTitles]); // canvasData.filter와 hiddenTitles에 의존

    
    // console.log(cardData);
    // console.log(hiddenTitles);
    // console.log(filterData);

    //GPTapi 사용
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    const [loading, setLoading] = useState(false);
    const [loadingScamper, setLoadingScamper] = useState(false);


    // Call insight card with 6Hats
    const callGPT = async () => {
        setLoading(true);  // 로딩 상태 시작
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            const data = await response.json();
            // console.log("API 응답:", data); 
            
            // API 키 관련 에러 체크
            if (response.status === 401 || response.status === 403 || (data.error && (
                data.error.message?.toLowerCase().includes('api key') ||
                data.error.message?.toLowerCase().includes('authentication') ||
                data.error.message?.toLowerCase().includes('invalid') ||
                data.error.message?.toLowerCase().includes('unauthorized')
            ))) {
                setApiKeyError(true);
                setLoading(false);
                return;
            }
                
            if (data.choices && data.choices.length > 0) {
                const responseText = data.choices[0].message.content;
                // console.log("응답 텍스트:", responseText); 
                    
                const parsedResult = parseResponse(responseText);
                
                const prompt6Hats = `
                    <참고데이터>에 대해 6hats 기법으로 분석 내용을 정리하여 <출력형식>에 맞춰 출력한다.
                    <참고데이터> ${parsedResult.content}.
                    <출력형식> - 정보:, - 감정:, - 이점:, - 위험:, - 창의:, - 정리:. 
                `;
    
                // console.log(prompt6Hats);
    
                // DALL-E로 이미지 생성
                const imageUrl = await generateImageWithDalle(parsedResult.content);
    
                const parsedHats = await callGPT6Hats(prompt6Hats);
    
                if (parsedHats) {
                    // Add insight card through CardContext
                    const timestamp = new Date().getTime().toString();
                    addCard({
                        id: timestamp,
                        type: "insight",
                        title: parsedResult.title,
                        content: parsedResult.content,
                        isHidden: false,
                        hats: {
                            '정보': parsedHats.정보 || '',
                            '감정': parsedHats.감정 || '',
                            '이점': parsedHats.이점 || '',
                            '위험': parsedHats.위험 || '',
                            '창의': parsedHats.창의 || '',
                            '정리': parsedHats.정리 || ''
                        },
                        imageUrl: imageUrl,
                        imagePath: imageUrl
                    });
                } else {
                    console.error('Failed to retrieve 6 hats information');
                }

            } else {
                console.error('No response from OpenAI');
            }
    
        } catch (error) {
            console.error('Error calling GPT:', error);
        } 
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 5000); // 5초 후에 로딩 상태를 false로 변경
        }
    };


    // Parse insight content
    const parseResponse = (response) => {
        let title = "Title not found";
        let content = "Content not found";
        
        const lines = response.split('\n');
        
        for (let line of lines) {
            if (line.startsWith("- 제목:")) {
            title = line.replace("- 제목:", "").trim();
            } else if (line.startsWith("- 내용:")) {
            content = line.replace("- 내용:", "").trim();
            }
        }
        return { title, content };
    };

    // DALL-E로 이미지 생성
    const generateImageWithDalle = async (content) => {
        try {
            // console.log('DALL-E 이미지 생성 시작:', content);
            
            // Convert Korean content to simple English prompt
            const imagePrompt = `A simple, minimalist illustration representing: ${content.substring(0, 100)}. Clean design, soft colors, friendly style.`;
            
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: imagePrompt,
                    n: 1,
                    size: "1024x1024"
                })
            });

            const data = await response.json();
            // console.log('DALL-E 응답:', data);

            // API 키 관련 에러 체크
            if (response.status === 401 || response.status === 403 || (data.error && (
                data.error.message?.toLowerCase().includes('api key') ||
                data.error.message?.toLowerCase().includes('authentication') ||
                data.error.message?.toLowerCase().includes('invalid') ||
                data.error.message?.toLowerCase().includes('unauthorized')
            ))) {
                setApiKeyError(true);
                return null;
            }

            if (data.data && data.data.length > 0) {
                const imageUrl = data.data[0].url;
                // console.log('생성된 이미지 URL:', imageUrl);
                return imageUrl;
            } else {
                console.error('DALL-E 이미지 생성 실패');
                return null;
            }
        } catch (error) {
            console.error('DALL-E 이미지 생성 오류:', error);
            return null;
        }
    };

    // 6Hats call function
    const callGPT6Hats = async (prompt6Hats) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt6Hats }]
                })
            });
            
            const data = await response.json();
            // console.log("API 응답:", data); // 응답 구조 확인
            
            // API 키 관련 에러 체크
            if (response.status === 401 || response.status === 403 || (data.error && (
                data.error.message?.toLowerCase().includes('api key') ||
                data.error.message?.toLowerCase().includes('authentication') ||
                data.error.message?.toLowerCase().includes('invalid') ||
                data.error.message?.toLowerCase().includes('unauthorized')
            ))) {
                setApiKeyError(true);
                return null;
            }
            
            if (data.choices && data.choices.length > 0) {
                const responseText = data.choices[0].message.content;
                // console.log("6 hats 응답 텍스트:", responseText); // 텍스트 확인
                
                // 6 hats 응답을 파싱
                const parsedHats = parse6HatsResponse(responseText);
                return parsedHats;
            } else {
                console.error('No response from OpenAI for 6 hats');
                return null;
            }
        } catch (error) {
            console.error('Error calling GPT for 6 hats:', error);
            return null;
        }
    };
    //6Hats 파싱
    const parse6HatsResponse = (response) => {
        // const hats = {};
        const hats = {
            '정보': '기본 정보',
            '감정': '기본 감정',
            '이점': '기본 이점',
            '위험': '기본 위험',
            '창의': '기본 창의',
            '정리': '기본 정리'
        };
        const lines = response.split('\n');
    

        for (let line of lines) {
            if (line.startsWith("- 정보:")) {
                hats['정보'] = line.replace("- 정보:", "").trim();
            } else if (line.startsWith("- 감정:")) {
                hats['감정'] = line.replace("- 감정:", "").trim();
            } else if (line.startsWith("- 이점:")) {
                hats['이점'] = line.replace("- 이점:", "").trim();
            } else if (line.startsWith("- 위험:")) {
                hats['위험'] = line.replace("- 위험:", "").trim();
            } else if (line.startsWith("- 창의:")) {
                hats['창의'] = line.replace("- 창의:", "").trim();
            } else if (line.startsWith("- 정리:")) {
                hats['정리'] = line.replace("- 정리:", "").trim();
            }
        }
        return hats;
    };


    const [selectedCardTitle, setSelectedCardTitle] = useState(''); // Selected card title
    const [selectedCardContent, setSelectedCardContent] = useState(''); // Selected card content
    const [selectedCardType, setSelectedCardType] = useState(''); // Selected card type
    const [selectedCardIndex, setSelectedCardIndex] = useState(null); // Selected card index
    const [selectedCardId, setSelectedCardId] = useState(null); // Selected card ID
    const [selectedCardHats, setSelectedCardHats] = useState({}); // Selected card hats
    
    const onCardCard = (index) => {
        setAddContainerOpacity(100);
        setIsCardClick(true);
        // setIsCardBack(false);
        setSelectedCardIndex(index);
        setSelectedCardTitle(cardData[index].title); // Set selected card title
        setSelectedCardContent(cardData[index].content); // Set selected card content
        setSelectedCardType(cardData[index].type); // Set selected card type
        setSelectedCardId(cardData[index].id); // Set selected card ID
        setSelectedCardHats(cardData[index].hats); // Set selected card hats
    };

    useEffect(() => {
        // console.log('Selected card title: ' + selectedCardTitle);
        // console.log('Selected card content: ' + selectedCardContent);
        // console.log('Selected card type: ' + selectedCardType);
        // console.log('Selected card index: ' + selectedCardIndex);
        // console.log('Selected card hats: ' + JSON.stringify(selectedCardHats));
    }, [selectedCardIndex, selectedCardTitle, selectedCardContent, selectedCardType, selectedCardId, selectedCardHats]);


    // const promptScamper = `${selectedCardContent}에 대해 scamper기법을 통해 창의적으로 확장한 아이디어 내용 한글로 작성해줘. Substitute:, Combine:, Adapt:, Modify:, Put to another use:, Eliminate:, Reverse:.`;

    const promptScamper = `
        <참고데이터>에 대해 scamper 기법으로 아이디어를 발전시켜 <요구사항>을 반영하여 <출력형식>에 맞춰 출력한다.
        <요구사항>
        - Idea content should be written in Korean.
        <참고데이터> ${selectedCardContent}.
        <출력형식> - Substitute:, - Combine:, - Adapt:, - Modify:, - Put to another use:, - Eliminate:, - Reverse:. 
    `;
    
    // console.log(promptScamper)
    
    const callScamper = async () => {
        setLoadingScamper(true);
        // console.log(promptScamper)
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: promptScamper }]
                })
            });
            
            const data = await response.json();
            // console.log("API 응답:", data); // 응답 구조 확인
            
            // API 키 관련 에러 체크
            if (response.status === 401 || response.status === 403 || (data.error && (
                data.error.message?.toLowerCase().includes('api key') ||
                data.error.message?.toLowerCase().includes('authentication') ||
                data.error.message?.toLowerCase().includes('invalid') ||
                data.error.message?.toLowerCase().includes('unauthorized')
            ))) {
                setApiKeyError(true);
                setLoadingScamper(false);
                return;
            }
            
            if (data.choices && data.choices.length > 0) {
                const responseText = data.choices[0].message.content;
                // console.log("scamper 응답 텍스트:", responseText); // 텍스트 확인
                
                const parsedScamper = parseScamperResponse(responseText);
                
                // Add SCAMPER cards through CardContext
                const timestamp = new Date().getTime().toString();
                Object.keys(parsedScamper).forEach(key => {
                    addCard({
                        id: `${timestamp}_${key}`,
                        type: "scamper",
                        title: selectedCardTitle,
                        mainTitle: key,
                        content: parsedScamper[key],
                        isHidden: false,
                        imagePath: "cardImage/cardimage001.png",
                        hats: {
                            '정보': 'Generating review content...',
                            '감정': 'Generating review content...',
                            '이점': 'Generating review content...',
                            '위험': 'Generating review content...',
                            '창의': 'Generating review content...',
                            '정리': 'Generating review content...'
                        }
                    });
                });
                
                return parsedScamper;
            } else {
                console.error('No response from OpenAI');
            }
        } catch (error) {
            console.error('Error calling GPT:', error);
        }
        finally {
            setTimeout(() => {
                setLoadingScamper(false);
            }, 5000); // 1초 후에 로딩 상태를 false로 변경
        }
    };

    const parseScamperResponse = (response) => {
        const scamper = {};
        const lines = response.split('\n');
    
        let currentScamper = null;
        for (let line of lines) {
            if (line.startsWith("- Substitute:")) {
                currentScamper = 'Substitute';
                scamper[currentScamper] = line.replace("- Substitute:", "").trim();
            } else if (line.startsWith("- Combine:")) {
                currentScamper = 'Combine';
                scamper[currentScamper] = line.replace("- Combine:", "").trim();
            } else if (line.startsWith("- Adapt:")) {
                currentScamper = 'Adapt';
                scamper[currentScamper] = line.replace("- Adapt:", "").trim();
            } else if (line.startsWith("- Modify:")) {
                currentScamper = 'Modify';
                scamper[currentScamper] = line.replace("- Modify:", "").trim();
            } else if (line.startsWith("- Put to another use:")) {
                currentScamper = 'Put to another use';
                scamper[currentScamper] = line.replace("- Put to another use:", "").trim();
            } else if (line.startsWith("- Eliminate:")) {
                currentScamper = 'Eliminate';
                scamper[currentScamper] = line.replace("- Eliminate:", "").trim();
            } else if (line.startsWith("- Reverse:")) {
                currentScamper = 'Reverse';
                scamper[currentScamper] = line.replace("- Reverse:", "").trim();
            }
        }
        return scamper;
    };


    const [addContainerOpacity, setAddContainerOpacity] = useState(20); // Activate scamper, 6hats buttons
    const [isCardClick, setIsCardClick] = useState(false); // Whether card is clicked
    const [isBoxClick, setIsBoxClick] = useState(false); // Whether (card/trash) is clicked

    const handlePageClick = () => {
        if (isCardClick) {
            setAddContainerOpacity(20);
            setIsCardClick(false);
        }
        setSelectedCardIndex(null);
        setBackedCardIndex(null);
        setSelectedCardTitle("");
        if(isBoxClick) {
            setIsBoxClick(false);
        }
        //이거 왜 if문으로 감싸야 작동하냐ㅡㅡ
        // setIsBoxClick(false);
    };


    const [zIndices, setZIndices] = useState([1, 2, 3]);
    const [bottoms, setBottoms] = useState([-100, -100, -100]);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const activeCardIndex = useRef(null);



    const handleTouchStart = (index, e) => {
    touchStartY.current = e.targetTouches[0].clientY;
    activeCardIndex.current = index;
    const newZIndices = zIndices.map((zIndex, i) => (i === index ? Math.max(...zIndices) + 1 : zIndex));
    setZIndices(newZIndices);
    };

    const handleTouchMove = (e) => {
    const currentY = e.targetTouches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    if (deltaY > 0 && deltaY <= 100 && activeCardIndex.current !== null) {
        const newBottoms = [...bottoms];
        newBottoms[activeCardIndex.current] = -100 + deltaY;
        setBottoms(newBottoms);
    }
    };

    const handleTouchEnd = (e) => {
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipeGesture();
    };

    const handleSwipeGesture = () => {
        const deltaY = touchStartY.current - touchEndY.current;
        if (activeCardIndex.current !== null) {
            const newBottoms = [...bottoms];
            if (deltaY > 100) {
            callGPT();
            }
            newBottoms[activeCardIndex.current] = -100;
            setBottoms(newBottoms);
        }
        activeCardIndex.current = null;
    };



    // Manage click timer
    const clickTimerRef = useRef(null);
    const clickCountRef = useRef(0);

    const boxClick = (e) => {
        e.stopPropagation();
        
        clickCountRef.current += 1;

        if (clickCountRef.current === 1) {
            // First click - wait 300ms
            clickTimerRef.current = setTimeout(() => {
                // Single click - draw card
                callGPT();
                clickCountRef.current = 0;
            }, 300);
        } else if (clickCountRef.current === 2) {
            // Double click - toggle filtering UI
            clearTimeout(clickTimerRef.current);
            setIsBoxClick(!isBoxClick);
            clickCountRef.current = 0;
        }
    };

    const clickAddScamper = () => {
        if( addContainerOpacity === 100){
            // console.log("scamper 생성")
            callScamper();
        }
    }

    const [backedCardIndex, setBackedCardIndex] = useState(null);  // Flipped card index

    const update6HatsForSelectedCard = (cardId, updatedHats) => {
        // CardContext를 통해 6Hats 업데이트
        updateCardHats(cardId, updatedHats);
    };


    const clickAdd6hats = async (e) => {
        e.stopPropagation();
    
        if (addContainerOpacity === 100) {
            setBackedCardIndex(selectedCardIndex);
            setAddContainerOpacity(20);
    
            if (selectedCardType === "scamper") {
                // console.log('Scamper card was clicked!');
    
                const cardId = selectedCardId; // Card ID
                // console.log("선택된 cardId:", cardId); // cardId 확인을 위한 로그
                
                // selectedCardHats가 올바르게 설정되었는지 확인
                if (!selectedCardHats || typeof selectedCardHats !== 'object') {
                    console.error("selectedCardHats가 올바르지 않습니다.");
                    return;
                }
    
                // Check if all hats items are 'Generating review content...' > If so, generate, otherwise don't generate since it already exists
                const isGeneratingHats = Object.values(selectedCardHats).every(
                    (value) => value === 'Generating review content...'
                );
    
                if (!isGeneratingHats) {
                    // console.log('Hats has already been generated or has other content.');
                    return;
                }
    
                const prompt6HatsForScamer =
                `<참고데이터>에 대해 6hats 기법으로 분석 내용을 정리하여 <출력형식>에 맞춰 출력한다.
                <참고데이터> ${selectedCardContent}.
                <출력형식> - 정보:, - 감정:, - 이점:, - 위험:, - 창의:, - 정리:. 
                `;
    
                try {
                    const parsedHats = await callGPT6Hats(prompt6HatsForScamer); // GPT 결과를 받아옴
                    // console.log('parsedHats:', parsedHats); // parsedHats의 실제 값 출력
    
                    if (parsedHats) {
                        update6HatsForSelectedCard(cardId, parsedHats); // Firebase에 업데이트
    
                    } else {
                        console.error('Failed to retrieve 6 hats information');
                    }
                } catch (error) {
                    console.error('Error calling GPT for 6 hats: ', error);
                }
            }
        }
    };
    
    
    
    const [boxState, setBoxState] = useState(false);
    // const handleBoxChange = (newBoxState) => {
    //     setBoxState(newBoxState)
    // }
    useEffect(() => {
        // console.log('박스 상태: ' + boxState)
    }, [boxState]);

    useEffect(() => {
        if (boxState) {
            setBottoms([-200, -200, -200]);
        } else {
            setBottoms([-100, -100, -100]);
        }
    }, [boxState]);



    const sizes = [0.5, 0.8, 1, 1.2, 1.5];
    const [currentSizeIndex, setCurrentSizeIndex] = useState(2); // 기본값: 1 (인덱스 2)
  
    const handleSizeUp = () => {
      if (currentSizeIndex < sizes.length - 1) {
        setCurrentSizeIndex(currentSizeIndex + 1);
      }
    };
  
    const handleSizeDown = () => {
      if (currentSizeIndex > 0) {
        setCurrentSizeIndex(currentSizeIndex - 1);
      }
    };

    // Added validation and logging for selectedCardType
    useEffect(() => {
        const validCardTypes = ['idea', 'insight', 'scamper']; // Define valid card types
        if (selectedCardType && !validCardTypes.includes(selectedCardType)) {
            console.error(`Unknown card type: ${selectedCardType}`);
        } else {
            // console.log(`Selected card type is valid: ${selectedCardType}`);
        }
    }, [selectedCardType, selectedCardContent, selectedCardId, selectedCardHats]);

    return(
    <>

                <Wrapper onClick={handlePageClick}>
                    {/* Second loading: displayed when loading is true */}
                    {loading && (
                        <LoadCard2>
                            <Lottie animationData={animationData} loop={true} style={{ width: 80, height: 80 }} />
                            <LoadCardText>카드를 만들고 있어요</LoadCardText>
                        </LoadCard2>
                    )}
                    {loadingScamper && (
                        <LoadCard3>
                            <Lottie animationData={animationData3} loop={true} style={{ width: 80, height: 80 }} />
                            <LoadCardText>카드를 만들고 있어요</LoadCardText>
                        </LoadCard3>
                    )}

                            <AddContainer opacity={addContainerOpacity}>
                                <AddScamper onClick={clickAddScamper} src="/icon/addScamper.png" width="48px"/>
                                <Add6hats onClick={clickAdd6hats} src="/icon/add6hats.png" width="48px"/>
                            </AddContainer>

                            {cardLoading ? (
                                <LoadCard>
                                    <Lottie animationData={animationData2} loop={true} style={{ width: 80, height: 80 }} />
                                    <LoadCardText>Loading card...</LoadCardText>
                                </LoadCard>
                            ) : (
                                <div>
                                    {cardData.filter(card => !card.isHidden).map((card, index) => {
                                        switch (card.type) {
                                            case 'idea':
                                                return (
                                                    <Card
                                                        index={index}
                                                        key={card.id || index}
                                                        onCardClick={() => onCardCard(index)}
                                                        card={card}
                                                        cardId={card.id}
                                                        isBackCard={backedCardIndex === index}
                                                        isSelected={selectedCardIndex === index}
                                                        onBoxStateChange={setBoxState}
                                                        cardSize={sizes[currentSizeIndex]}
                                                    />
                                                );
                                            case 'insight':
                                                return (
                                                    <Card
                                                        index={index}
                                                        key={card.id || index}
                                                        onCardClick={() => onCardCard(index)}
                                                        card={card}
                                                        cardId={card.id}
                                                        isBackCard={backedCardIndex === index}
                                                        isSelected={selectedCardIndex === index}
                                                        onBoxStateChange={setBoxState}
                                                        cardSize={sizes[currentSizeIndex]}
                                                    />
                                                );
                                            case 'scamper':
                                                return (
                                                    <CardS
                                                        index={index}
                                                        key={card.id || index}
                                                        onCardClick={() => onCardCard(index)}
                                                        card={card}
                                                        cardId={card.id}
                                                        isBackCard={backedCardIndex === index}
                                                        isSelected={selectedCardIndex === index}
                                                        onBoxStateChange={setBoxState}
                                                        cardSize={sizes[currentSizeIndex]}
                                                    />
                                                );
                                            default:
                                                return (
                                                    <div key={index}>Unknown card type</div>
                                                );
                                        }
                                    })}
                                </div>
                            )}


                            {isBoxClick && <Filter />}

                            <div>
                                <BoxCard
                                    $zIndex={zIndices[0]}
                                    $bottom={bottoms[0]}
                                    onTouchStart={(e) => handleTouchStart(0, e)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={boxClick}
                                />
                                <BoxCard2
                                    $zIndex={zIndices[1]}
                                    $bottom={bottoms[1]}
                                    onTouchStart={(e) => handleTouchStart(1, e)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={boxClick}
                                />
                                <BoxCard3
                                    $zIndex={zIndices[2]}
                                    $bottom={bottoms[2]}
                                    onTouchStart={(e) => handleTouchStart(2, e)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={boxClick}
                                />
                            </div>

                            <Box2 $boxState={boxState} src="/icon/mainTrash.png" width="80px"/>

                            <SizeContainer>
                                <img
                                    src="/sizeUp.png" width="48px"
                                    onClick={handleSizeUp}
                                    alt="Size up"
                                />
                                <img
                                    src="/sizeDown.png" width="48px"
                                    onClick={handleSizeDown}
                                    alt="Size down" 
                                />
                            </SizeContainer>
                </Wrapper>
        </>
    )
};

export default Canvas;