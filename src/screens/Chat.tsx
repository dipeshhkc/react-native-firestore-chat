import {useRoute} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {useInfiniteQuery, useMutation} from 'react-query';
import {chatService, User} from '../service/chat';
import {spreadArray} from '../utility/spreadArray';

export const Chat = () => {
  const route = useRoute();
  const {user} = route.params as {user: User};
  const queryKey = ['messages', user.roomId];
  const [message, setMessage] = useState('');
  const [hasPreviousMessage, setHasPreviousMessage] = useState(false);

  const {
    data,
    fetchNextPage: fetchPreviousMessage,
    isFetchingNextPage: fetchingMessage,
  } = useInfiniteQuery(queryKey, chatService.getMessages, {
    getNextPageParam: lp => {
      if (lp.length) {
        return lp?.[lp.length - 1].createdAt;
      }
    },
  });

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
        avatar: 'https://placeimg.com/140/140/people',
      },
    };
  }) as IMessage[];

  useEffect(() => chatService.attachMessageListener(queryKey), [user.roomId]);

  const lastDate = messages?.[messages.length - 1]?.createdAt;

  useEffect(() => {
    const getNextPage = async () => {
      const np = await chatService.hasMessageBefore(user.roomId, lastDate);
      setHasPreviousMessage(np);
    };
    if (lastDate && user.roomId) {
      getNextPage();
    }
  }, [lastDate, user.roomId]);

  const onSend = useCallback(() => {
    sendMutation.mutate({
      roomId: user?.roomId,
      text: message,
      username: user?.username,
    });
  }, [message, user]);

  return (
    <View style={styles.container}>
      <GiftedChat
        text={message}
        onInputTextChanged={val => {
          setMessage(val);
        }}
        loadEarlier={hasPreviousMessage}
        isLoadingEarlier={fetchingMessage}
        onLoadEarlier={fetchPreviousMessage}
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
