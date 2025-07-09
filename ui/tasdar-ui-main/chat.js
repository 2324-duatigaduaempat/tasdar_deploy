import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('https://tasdar-coach.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text); // Cuba parse JSON
      } catch (jsonErr) {
        setMessages([...newMessages, { role: 'assistant', content: '❌ Ralat sambungan: Bukan format JSON sah (' + jsonErr.message + ')' }]);
        return;
      }

      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: '❌ Tiada balasan dari server.' }]);
      }

    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '❌ Gagal berhubung dengan AI: ' + err.message }]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', textAlign: 'center', marginTop: '60px' }}>
      <h1>TAS.DAR Coach AI</h1>
      <p>Sila taip mesej pertama anda...</p>

      <div style={{ marginTop: '30px', minHeight: '200px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'left', background: '#f9f9f9' }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <b>{msg.role === 'user' ? '🧍‍♂' : '🤖'} :</b> {msg.content}
          </p>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '75%', padding: '10px', fontSize: '16px' }}
          placeholder="Tulis mesej di sini..."
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px', background: '#5e60ce', color: 'white', border: 'none', borderRadius: '5px' }}>
          Hantar
        </button>
      </div>
    </div>
  );
}
