import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import socket from "@/socket/socket";
import { styles } from "@/styles";

export default function App() {
    const roomPrefix = 'chat';

    // Form 1
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    // Form 1
    const [message2, setMessage2] = useState('');
    const [receivedMessage2, setReceivedMessage2] = useState('');

    useEffect(() => {
        socket.emit('join_room', 'chat-1');
        socket.emit('join_room', 'chat-2');

        socket.on('receive_message', (response: {room: string, msg: string }) => {
            console.log(response)
            if (response.room === 'chat-1') {
                setReceivedMessage(response.msg);
            } else if (response.room === 'chat-2') {
                setReceivedMessage2(response.msg);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    const sendMessage = (chat: string) => {
        const targetRoom = `${roomPrefix}-${chat}`;
        const msg = chat === '1' ? message : message2;

        socket.emit('send_message', { room: targetRoom, message: msg });

        if (chat === '1') {
            setMessage('')
        } else {
            setMessage2('')
        };
    };

    return (
        <View style={styles.container}>

            {/* Form 1 */}
            <View>
                <Text style={styles.title}>Canal: Chat 1</Text>

                <TextInput
                    placeholder="Digite sua mensagem"
                    value={message}
                    onChangeText={setMessage}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={() => sendMessage('1')}>
                    <Text style={styles.buttonText}>Enviar Mensagem</Text>
                </TouchableOpacity>

                <Text style={styles.receivedMessageTitle}>Mensagem Recebida:</Text>
                <Text style={styles.receivedMessage}>{receivedMessage2 || 'nenhuma mensagem recebida'}</Text>
            </View>

            <View style={styles.line}></View>

            {/* Form 2 */}
            <View>
                <Text style={styles.title}>Canal: Chat 2</Text>

                <TextInput
                    placeholder="Digite sua mensagem"
                    value={message2}
                    onChangeText={setMessage2}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={() => sendMessage('2')}>
                    <Text style={styles.buttonText}>Enviar Mensagem</Text>
                </TouchableOpacity>

                <Text style={styles.receivedMessageTitle}>Mensagem Recebida:</Text>
                <Text style={styles.receivedMessage}>{receivedMessage || 'nenhuma mensagem recebida'}</Text>
            </View>
        </View>
    );
}
