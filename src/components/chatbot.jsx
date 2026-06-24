import { SendHorizontal, Image as ImageIcon, X, AudioWaveform } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const chatContainerRef = useRef(null);

    const key = process.env.VITE_GOOGLE_API_KEY || 'your_api_key_here';
    const genAI = new GoogleGenerativeAI(key);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputMessage.trim() === "" && selectedImages.length === 0) return;
        const userMessage = {
            text: inputMessage,
            sender: "user",
            images: imagePreviewUrls
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b", systemInstruction: "you are a very helpful virtual tourguide,You are the best in your field and can answer anything related to cultural and tourism.Dont answer questions other than these topics, like u should not answer questions related to cricket and stuff....say u are limited" });

            const contentParts = [{ text: inputMessage }];

            if (selectedImages.length > 0) {
                for (const image of selectedImages) {
                    const imageData = await readFileAsBase64(image);
                    contentParts.push({
                        inlineData: {
                            data: imageData.split(',')[1],
                            mimeType: image.type
                        }
                    });
                }
            }

            const result = await model.generateContent({
                contents: [{ role: "user", parts: contentParts }]
            });

            const response = result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, {
                text: responseText,
                sender: "bot"
            }]);

        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, {
                text: "Sorry, I encountered an error. Please try again.",
                sender: "bot"
            }]);
        } finally {
            setIsLoading(false);
            setInputMessage("");
            setSelectedImages([]);
            setImagePreviewUrls([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSelectedImages(prevImages => [...prevImages, ...files]);

        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prevUrls => [...prevUrls, ...newImageUrls]);

        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prevImages => {
            const updated = [...prevImages];
            updated.splice(index, 1);
            return updated;
        });

        setImagePreviewUrls(prevUrls => {
            URL.revokeObjectURL(prevUrls[index]);
            const updated = [...prevUrls];
            updated.splice(index, 1);
            return updated;
        });
    };
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Speech Recognition not supported");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(prev => prev + " " + transcript);
        };

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
    }, []);


    useEffect(() => {
        const savedMessages = sessionStorage.getItem("chat-messages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("chat-messages", JSON.stringify(messages));
    }, [messages]);

    const handleMicClick = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="fixed top-[17%] rounded-xl h-[80%] left-[10%] w-[80%] bg-black/15 flex flex-col">
            <div className="mt-4 ml-[90%] h-[10%] text-3xl flex-end font-pixel bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
                <p className="flex flex-row">
                    AVA
                </p>
            </div>
            <div
                ref={chatContainerRef}
                className="h-[70%] overflow-y-auto px-6 py-4 scrollbar scrollbar-none"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}
                    >
                        <div
                            className={`inline-block max-w-[70%] rounded-xl p-3 ${message.sender === "user"
                                ? "bg-violet-500/40 text-purple-100"
                                : "bg-orange-500/40 text-orange-100"
                                }`}
                        >
                            {message.images && message.images.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2 items-center">
                                    {message.images.map((imgUrl, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={imgUrl}
                                            alt={`User uploaded ${imgIndex}`}
                                            className="w-16 h-16 object-cover rounded-md border-2 border-orange-500"
                                        />
                                    ))}
                                </div>
                            )}
                            <div className={`${message.sender === 'user' ? 'font-pixel text-xs' : ' font-pixel text-xs prose prose-sm'}`}>
                                <ReactMarkdown>
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="text-left">
                        <div className="inline-block bg-orange-500/40 rounded-xl p-3">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-[15%] flex flex-col items-center">
                <div className="w-[60%] relative">
                    {/* Image preview area that expands upward */}
                    {imagePreviewUrls.length > 0 && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-orange-500/30">
                            <div className="flex flex-wrap gap-2 justify-start">
                                {imagePreviewUrls.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Preview ${index}`}
                                            className="w-16 h-16 object-cover rounded-md border border-orange-300/50"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 hover:bg-red-500 transition-colors border border-orange-300/30"
                                            aria-label="Remove image"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input area - stays fixed at bottom */}
                    <div className="w-full  bg-black/30 rounded-xl p-2">
                        <div className="w-full bg-black/20 rounded-xl flex items-center p-2">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="w-full font-pixel text-xs text-orange-300 tracking-tighter bg-transparent border-none resize-none outline-none h-8"
                            />

                            <button
                                onClick={handleMicClick}
                                className={`text-purple-400 hover:text-purple-300 transition-colors ${isRecording ? 'text-red-500' : ''}`}
                            >
                                <AudioWaveform size={18} />
                            </button>

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="mx-2 text-purple-400 hover:text-purple-300 transition-colors"
                                aria-label="Upload image"
                            >
                                <ImageIcon size={18} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <button
                                onClick={handleSendMessage}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                aria-label="Send message"
                            >
                                <SendHorizontal size={18} />
                            </button>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
            );
}