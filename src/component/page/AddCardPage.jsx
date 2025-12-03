import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion";
import { ApiKeyContext } from '../../context';
import { useCardContext } from '../../context/CardContext';
import Lottie from 'lottie-react';
import animationData from '../../lotties/card_loading.json';
import styled from "styled-components";
import Button from "../ui/Button";
import Draw from "../ui/Draw";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    touch-action: none;
`;
const CloseIcon = styled.img`
    position: absolute;
    top: 24px;
    right: 40px;
    cursor: pointer;
`;
const StyledInput = styled.input`
    width: 440px;
    padding-bottom: 12px;
    border: none;
    border-bottom: 1px solid #969BA4;
    background: none;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: #969BA4;
    position: relative;
    &::placeholder {
        color: #969BA4;
    };
    &:focus {
        border-color: #424BA5;
        outline: none;
        color: #424BA5;
    };
`;
const StyledTextArea = styled.textarea`
    width: 440px;
    height: 235px;
    padding: 16px;
    border: 1px solid #969BA4;
    font-size: 20px;
    resize: none;
    &:focus {
        outline: none;
        color: #424BA5;
        border-color: #424BA5;
    };
`;
const AddContainer = styled.div`
    width: 440px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    position: relative;
    opacity: ${props => (props.$loading ? '0' : '1')};
    transform: ${props => (props.$loading ? 'scale(0.3)' : 'scale(1)')};
    transition: transform opacity 0.3s ease-in;
`;
const LoadCard = styled.div`
    width: 224px;
    height: 300px;
    // background-color: #fff;
    border-radius: 12px;
    // box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 112px);
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
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
    color: #333;
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
    background-image: url(${props => props.image});
    background-size: cover;
    background-color: #E9ECF0;
`;
const CardText = styled.p`
    margin: 0;
    width: 196px;
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
const CardFace = styled(motion.div)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px 12px 12px 12px;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    // background-color: ${props => (props.isFlip ? '#5F6471' : '#FFF')};
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
`;
const CardFaceBack = styled(motion.div)`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    // padding: 16px 12px 12px 12px;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    background-color: #5F6471;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    // position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
`;
const CardTextBack = styled.p`
    font-size: 18px;
    font-weight: 600;
    color: #fff;
`;

function AddCardPage(props) {

    const navigate = useNavigate();
    const { apiKey, setApiKeyError } = useContext(ApiKeyContext);
    const { addCard } = useCardContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        // console.log(loading);
    },[loading])

    const endpoint = "https://api.openai.com/v1/chat/completions";

    const prompt6Hats = `${content}에 대해 6hats 기법으로 정리해줘. - 정보:, - 감정:, - 이점:, - 위험:, - 창의:, - 정리:.`;
    const callGPT6Hats = async (prompt6Hats) => {
        // console.log(prompt6Hats)
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
                setLoading(false);
                return null;
            }
            
            if (data.choices && data.choices.length > 0) {
                const responseText = data.choices[0].message.content;
                // console.log("6 hats 응답 텍스트:", responseText); // 텍스트 확인
                
                // 6 hats 응답을 파싱
                const parsedHats = parse6HatsResponse(responseText);
                
                // 결과 반환
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

    // 6 hats 응답을 파싱하는 함수
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

    
    // Save card image
    const imageCanvasRef = useRef(null);
    const drawingCanvasRef = useRef(null);
    const combinedCanvasRef = useRef(null);

    useEffect(() => {
        if (imageCanvasRef.current && drawingCanvasRef.current && combinedCanvasRef.current) {
            // console.log('All canvases are initialized');
        } else {
            console.error('One or more canvases are not initialized');
        }
    }, [imageCanvasRef, drawingCanvasRef, combinedCanvasRef]);

    const [mergedImageURL, setMergedImageURL] = useState(null);

    const mergeCanvases = () => {
        const imageCanvas = imageCanvasRef.current;
        const drawingCanvas = drawingCanvasRef.current;
        const combinedCanvas = combinedCanvasRef.current;

        if (!imageCanvas || !drawingCanvas || !combinedCanvas) {
            console.error('One or more canvas references are not initialized.');
            return;
        }

        const combinedContext = combinedCanvas.getContext('2d');
        combinedCanvas.width = imageCanvas.width;
        combinedCanvas.height = imageCanvas.height;

        combinedContext.clearRect(0, 0, combinedCanvas.width, combinedCanvas.height);
        combinedContext.drawImage(imageCanvas, 0, 0);
        combinedContext.drawImage(drawingCanvas, 0, 0);

        // 병합된 캔버스를 데이터 URL로 변환
        const dataURL = combinedCanvas.toDataURL('image/png');
        setMergedImageURL(dataURL);
    };


    const handleSave = async () => {
        if (!title || !content) return; // Make input fields red if empty

        // console.log('Save card clicked');
        setLoading(true); // Set loading state when save is clicked

        // 먼저 캔버스를 병합하고 URL을 생성합니다.
        mergeCanvases();

        const parsedHats = await callGPT6Hats(prompt6Hats);
        if (parsedHats) {
            const timestamp = new Date().getTime().toString();
            
            // Get image data URL from merged canvas
            const canvas = combinedCanvasRef.current;
            const imageDataURL = canvas ? canvas.toDataURL('image/png') : null;

            // Add card through CardContext
            addCard({
                id: timestamp,
                title: title,
                content: content,
                type: "idea",
                hats: {
                    '정보': parsedHats.정보,
                    '감정': parsedHats.감정,
                    '이점': parsedHats.이점,
                    '위험': parsedHats.위험,
                    '창의': parsedHats.창의,
                    '정리': parsedHats.정리
                },
                imageUrl: imageDataURL, // Save image data URL
                imagePath: imageDataURL, // Also save to imagePath for compatibility
                isHidden: false
            });

            // console.log('Card successfully added to context!');
            
            // Navigate after a slight delay to show loading animation
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } else {
            console.error('6 hats 분석 결과가 없습니다.');
            setLoading(false);
        }
    };

    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const flipInterval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 1500);
        return () => clearInterval(flipInterval);
    }, []);


    return (
        <Wrapper>
            {loading && 

                <LoadCard

                    initial={{ opacity: 0 }}  // 초기 위치와 상태
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 50, duration: 1, delay: 1 }} // 초기 애니메이션 전환 설정 
                >
                    <AnimatePresence>
                        {isFlipped ? (
                        <CardFace
                            key="back"
                            initial={{ rotateY: 180 }}
                            animate={{ rotateY: 0 }}
                            exit={{ rotateY: -180 }}
                            transition={{ duration: 0.6 }}
                            style={{ position: 'absolute', width: '100%' }}
                        >
                            {/* Content to show when flipped */}
                            <CardIcon src="/card_type=idea.png" width="24px" />
                            <CardTitle>{title}</CardTitle>
                            <CardContent>
                            <CardImage image={mergedImageURL} />
                            <CardText>{content}</CardText>
                            </CardContent>
                        </CardFace>
                        ) : (
                        <CardFaceBack
                            key="front"
                            initial={{ rotateY: -180 }}
                            animate={{ rotateY: 0 }}
                            exit={{ rotateY: 180 }}
                            transition={{ duration: 0.6 }}
                            style={{ position: 'absolute', width: '100%' }}
                            // isFlip={true}
                        >
                            {/* Content to show on front side */}
                            <Lottie animationData={animationData} loop={true} style={{ width: 80, height: 80 }} />
                            <CardTextBack>카드를 저장하고 있어요</CardTextBack>
                        </CardFaceBack>
                        )}
                    </AnimatePresence>
                </LoadCard>
            }

            {!loading && (<CloseIcon src="/icon/close2.png" width="32px" onClick={()=>{navigate(-1)}}/>)}

            <AddContainer $loading={loading}>
                <StyledInput type="text" placeholder="Enter title" maxLength="12"  onChange={(e)=>setTitle(e.target.value)}></StyledInput>
                <Draw imageCanvasRef={imageCanvasRef} drawingCanvasRef={drawingCanvasRef} />
                {/* <Draw canvasRef={canvasRef}></Draw> */}
                <canvas ref={combinedCanvasRef} style={{ display: 'none' }}></canvas> {/* 가상의 combinedCanvas */}

                <StyledTextArea placeholder="Enter content" onChange={(e)=>setContent(e.target.value)}></StyledTextArea>
            </AddContainer>

            {!loading && (<Button onClick={() => handleSave()} disabled={!title || !content}></Button>)}
        </Wrapper>
    );
}

export default AddCardPage;
