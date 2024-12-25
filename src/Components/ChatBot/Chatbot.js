import React, { useState, useEffect, useRef } from 'react';
import Draggable  from 'react-draggable'; 
import { FcFlashOn } from "react-icons/fc";
import { VscChromeClose } from "react-icons/vsc";
import { FcExpand } from "react-icons/fc";
import chatbotgif from '../../Asset/Chatbot/Video/chatbot_animation.mp4'
import { getISTDate } from '../../utils/validators';
import { ChatBot_URL } from '../../utils/config';
import axios from 'axios';
import { BiMove } from "react-icons/bi";
//<FcFlashOn />

const Chatbot =({greets})=> {
  // console.log(greets);
  // console.log('Draggable:', Draggable);
  const {defaultValues} = getISTDate();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const chatEndRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState(null);
  const dragThreshold = 5;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const currentTime =  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    console.log(currentTime);

    setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: userInput, time: currentTime }
    ]);
    setUserInput('');

    setIsBotTyping(true);

    try {
      const response = await axios.post(ChatBot_URL, {input_text: userInput});

      const data = response.data;

      const botResponse = data?.response ||  "I'm here to assist you with MultiFacet Software System Pvt. Ltd. What do you need help with?"; 
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setIsBotTyping(false); 
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'bot', text: botResponse, time: botTime },
    ]);

  } catch (error) {
    console.error('Error calling API:', error);
    setIsBotTyping(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'bot', text: 'There was an error with the API. Please try again later.', time: currentTime },
    ]);
  }
  };

  const toggleChat = () => {
    if (isChatOpen) {
      setMessages([]); 
    } else {
      // Add greeting message when chat is opened
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: greets, time: currentTime }
      ]);
    }
    if (!isDragging) {
      setIsChatOpen(!isChatOpen); 
    }
  };


  return (
    <div>
      {!isChatOpen && (
        <Draggable>
          <div className="fixed bottom-5 right-5 z-50">
            <video
              src={chatbotgif}
              className="h-16 w-16 rounded-full cursor-pointer"
              autoPlay
              muted
              loop
              onClick={toggleChat}
            />
          </div>
        </Draggable>
      )}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 h-[70%] w-full md:w-96 bg-white flex flex-col shadow-lg z-50">
          <div className="bg-orange-600 text-white p-4 flex justify-between items-center rounded-b-lg">
            <h1 className="text-lg font-semibold">ChatBot</h1>
            <button onClick={toggleChat}>
              <VscChromeClose size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user' ? 'bg-blue-400 text-white' : 'bg-gray-200'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="mb-2 flex justify-start">
                <div className="p-3 rounded-lg bg-gray-200 italic">Typing...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t border-gray-300">
            <div className="flex">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-green-600 text-white rounded-r-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;