import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import { getDatabase, ref, push, onValue } from 'firebase/database';

interface Message {
    text: string;
    timestamp: number;
}

const firebaseConfig = {
    apiKey: "AIzaSyAHrHOJWjrLb3A6l8rv5EuMBezRJ3MJ9U0",
    authDomain: "nervcreative-5f390.firebaseapp.com",
    databaseURL: "https://nervcreative-5f390-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export default function TestComponent(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        signInAnonymously(auth)
            .then(({ user }) => setUser(user))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!user) return;

        const messagesRef = ref(db, 'testMessages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages(data ? Object.values(data) : []);
        });

        return () => unsubscribe();
    }, [user]);

    const sendMessage = async (): Promise<void> => {
        if (!user || !message.trim()) return;

        const newMessage: Message = {
            text: message,
            timestamp: Date.now()
        };

        try {
            await push(ref(db, 'testMessages'), newMessage);
            setMessage('');
        } catch (error) {
            console.error('Send failed:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                style={{ marginRight: '10px', padding: '5px' }}
            />
            <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
                Send
            </button>
            <div style={{ marginTop: '20px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ padding: '5px 0' }}>
                        {msg.text} <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
                    </div>
                ))}
            </div>
        </div>
    );
}