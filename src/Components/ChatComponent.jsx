import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const SearchBar = styled.div`
  padding: 10px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  
`;

const LeftBox = styled.div`
  flex: 1;
  border-right: 1px solid #ccc;
  border-top: 1px solid #ccc;

`;

const RightBox = styled.div`
  flex: 1;
  border-top: 1px solid #ccc;
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 20px;

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    font-size: 16px; 
  }

  button {
    background-color: #007bff;
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const MessageContainer = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  &.user {
    text-align: right;
    color: #007bff;
  }

  &.assistant {
    text-align: left;
    color: #28a745;
  }
`;

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    const modelName = 'gpt-4';
    const maxTokens = 200;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: input },
          ],
          model: modelName,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        }
      );

      console.log(response);

      setMessages([...messages, { role: 'assistant', content: response.data.choices[0].message.content }]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container>
      <SearchBar>
        <InputContainer>
          <input type="text" value={input} onChange={handleInputChange} />
          <button onClick={handleSendMessage}>Send</button>
        </InputContainer>
      </SearchBar>
      <MainContent>
        <LeftBox>
          {/* Content for the left box */}
        </LeftBox>
        <RightBox>
          {messages.map((message, index) => (
            <MessageContainer key={index} className={message.role}>
              {message.content}
            </MessageContainer>
          ))}
        </RightBox>
      </MainContent>
    </Container>
  );
};

export default ChatComponent;
