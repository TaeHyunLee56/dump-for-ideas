import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";


const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #969BA4;
`;

const CanvasContainer = styled.div`
    position: relative;
    width: 440px;
    height: 288px;
`;

const DrawContainer = styled.div`
    width: 40px;
    padding: 8px;
    border-radius: 999px;
    background-color: #E6584A;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const ToolContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: absolute;
    top: 100px;
    left: -64px;
`;

const ColorSelect = styled.input`
    width: 24px;
    height: 28px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    background-color: transparent;
    &::-webkit-color-swatch {
        border: 2px solid #fff;
        border-radius: 999px;
    }
`;

function Draw({ imageCanvasRef, drawingCanvasRef }) {
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState('black');
    const [isErasing, setIsErasing] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const drawingContext = useRef(null);
    const imageContext = useRef(null);

    useEffect(() => {
        const drawingCanvas = drawingCanvasRef.current;
        drawingContext.current = drawingCanvas.getContext('2d');

        const imageCanvas = imageCanvasRef.current;
        imageContext.current = imageCanvas.getContext('2d');

        console.log("Canvas contexts initialized:", drawingContext.current, imageContext.current);
    }, [drawingCanvasRef, imageCanvasRef]);

    const startDrawing = (e) => {
        setDrawing(true);
        draw(e);
        console.log("Start Drawing");
    };

    const finishDrawing = () => {
        setDrawing(false);
        drawingContext.current.beginPath();
        console.log("Finish Drawing");
    };

    const draw = (e) => {
        if (!drawing) return;

        const canvas = drawingCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        drawingContext.current.lineWidth = isErasing ? 20 : 3;
        drawingContext.current.lineCap = 'round';
        drawingContext.current.strokeStyle = isErasing ? 'white' : color;

        drawingContext.current.lineTo(x, y);
        drawingContext.current.stroke();
        drawingContext.current.beginPath();
        drawingContext.current.moveTo(x, y);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = imageCanvasRef.current;
                const ctx = imageContext.current;

                const canvasAspect = canvas.width / canvas.height;
                const imageAspect = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasAspect > imageAspect) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imageAspect;
                } else {
                    drawHeight = canvas.height;
                    drawWidth = canvas.height * imageAspect;
                }

                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = (canvas.height - drawHeight) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                setImageUploaded(true);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        imageContext.current.clearRect(0, 0, imageCanvasRef.current.width, imageCanvasRef.current.height);
        setImageUploaded(false);
    };

    //첨에만 애니메이션 재생되도록
    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (initialRender) {
            setInitialRender(false);
        }
    }, [initialRender]);

    return (
        <div>
            <CanvasContainer>
                <Canvas ref={imageCanvasRef} width={440} height={288} />
                <Canvas ref={drawingCanvasRef}
                        width={440} height={288}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={finishDrawing}
                        onTouchMove={draw}
                />
            </CanvasContainer>
            <ToolContainer>
                <DrawContainer>
                    <ColorSelect type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <motion.img
                        onClick={() => setIsErasing(false)} whileTap={{ scale: 0.6 }}
                        src={`/icon/draw_${isErasing ? 'inactive' : 'active'}.png`} width="24px"
                    />
                    <motion.img
                        onClick={() => setIsErasing(true)} whileTap={{ scale: 0.6 }}
                        src={`/icon/erase_${isErasing ? 'active' : 'inactive'}.png`} width="24px"
                    />
                </DrawContainer>
                {!imageUploaded ? (
                    <>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="fileUpload" />
                        <label htmlFor="fileUpload">
                            <motion.img
                                    whileTap={{ scale: 0.8 }}
                                    initial={initialRender ? { y: -80, opacity: 0, scale: 0.5 } : false}  // 초기 위치와 상태
                                    animate={initialRender ? { y: 0, opacity: 1, scale: 1 } : false}
                                    transition={{ type: 'spring', stiffness: 50, duration: 1 }} // 초기 애니메이션 전환 설정                          
                                    src="/icon/addImgBtn.png" width="40px" style={{ cursor: 'pointer' }}
                            />
                        </label>
                    </>
                ) : (
                    <label onClick={removeImage}>
                        <motion.img 
                                    whileTap={{ scale: 0.8 }}
                                    // initial={{  y: -80, opacity: 0, scale: 0.5 }}  // 초기 위치와 상태
                                    // animate={{ y: 0, opacity: 1, scale: 1 }}   // 화면 렌더링 후 애니메이션될 위치와 상태
                                    // transition={{ type: 'spring', stiffness: 50, duration: 1 }} // 초기 애니메이션 전환 설정     
                                    src="/icon/removeImgBtn.png" width="40px" style={{ cursor: 'pointer' }}
                        />
                    </label>
                )}

                <motion.img
                    whileTap={{ scale: 0.8 }}
                    initial={{  y: -160, opacity: 0, scale: 0.5 }}  // 초기 위치와 상태
                    animate={{ y: 0, opacity: 1, scale: 1 }}   // 화면 렌더링 후 애니메이션될 위치와 상태
                    transition={{ type: 'spring', stiffness: 50, duration: 1}} // 초기 애니메이션 전환 설정     
                    onClick={() => {
                        drawingContext.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
                        // setImageUploaded(false); // 이미지 업로드 상태 업데이트
                    }}
                    src="/icon/resetBtn.png" width="40px"
                />
            </ToolContainer>
        </div>
    );
}

export default Draw;
