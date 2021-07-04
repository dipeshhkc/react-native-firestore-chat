import {useRoute} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {useInfiniteQuery, useMutation} from 'react-query';
import {chatService, User} from '../service/chat';
import {spreadArray} from '../utility/spreadArray';

export const Chat = () => {
  const route = useRoute();
  const {user} = route.params as {user: User};
  const queryKey = ['messages', user.roomId];
  const [message, setMessage] = useState('');

  const {data} = useInfiniteQuery(queryKey, chatService.getMessages);

  const sendMutation = useMutation(chatService.sendMessage, {
    onMutate: () => {
      setMessage('');
    },
  });

  const messages = spreadArray(data?.pages);
  const giftedMessages = messages.map(message => {
    return {
      _id: message?.id,
      text: message?.text,
      createdAt: message?.createdAt,
      user: {
        _id: message?.username,
        name: message?.username,
        avatar: 'https://placeimg.com/140/140/any',
      },
    };
  }) as IMessage[];

  useEffect(() => chatService.attachMessageListener(queryKey), [user.roomId]);

  const onSend = useCallback(() => {
    sendMutation.mutate({
      roomId: user?.roomId,
      text: message,
      username: user?.username,
    });
  }, [message, user]);

  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
      <GiftedChat
        text={message}
        onInputTextChanged={val => {
          setMessage(val);
        }}
        messages={giftedMessages}
        onSend={() => onSend()}
        user={{
          _id: user?.username,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
});
