import { useState } from 'react';
import Chat from './components/Chat/Chat';
import Detail from './components/Detail/Detail';
import UserList from './components/List/UserList';

import './App.css';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="container">
      <UserList onSelectUser={setSelectedUser} />
      {selectedUser && <Chat selectedUser={selectedUser} />}
      {selectedUser && <Detail selectedUser={selectedUser} />}
    </div>
  );
}

export default App;
