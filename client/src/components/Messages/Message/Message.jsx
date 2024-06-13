// import React from 'react';
// import './Message.css';
// import ReactEmoji from 'react-emoji';

// const Message = ({ message: { message, userId }, name }) => {
//   const isSentByCurrentUser = userId === name.trim().toLowerCase();
//   const isSentByAI = userId === '259295097276676';

//   return isSentByCurrentUser ? (
//     <div className="messageContainer justifyEnd">
//       <p className="sentText pr-10">{name.trim()}</p>
//       <div className="messageBox backgroundBlue">
//         <p className="messageText colorWhite">{ReactEmoji.emojify(message)}</p>
//       </div>
//     </div>
//   ) : isSentByAI ? (
//     <div className="messageContainer justifyStart">
//       <div className="messageBox backgroundLight">
//         <p className="messageText colorDark">{ReactEmoji.emojify(message)}</p>
//       </div>
//       <p className="sentText pl-10">AI</p>
//     </div>
//   ) : (
//     <div className="messageContainer justifyStart">
//       <div className="messageBox backgroundLight">
//         <p className="messageText colorDark">{ReactEmoji.emojify(message)}</p>
//       </div>
//       <p className="sentText pl-10">{userId}</p>
//     </div>
//   );
// };

// export default Message;

import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message: { message, userId }, name }) => {
  let isSentByCurrentUser = userId === '259295097276676';

  const trimmedName = name.trim().toLowerCase();

  if (userId === trimmedName) {
    isSentByCurrentUser = true;
  }

  if (!message) return null;

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(message)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(message)}</p>
      </div>
      <p className="sentText pl-10">{userId}</p>
    </div>
  );
};

export default Message;
