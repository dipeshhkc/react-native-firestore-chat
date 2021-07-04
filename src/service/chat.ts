import {
  InfiniteData,
  MutationFunction,
  QueryFunction,
  QueryKey,
} from 'react-query';
import {queryClient} from '../config/queryClient';
import firestore from '@react-native-firebase/firestore';
import {spreadArray} from '../utility/spreadArray';

export interface User {
  roomId: string;
  username: string;
}

export interface ChatMessage extends User {
  text: string;
  createdAt?: Date;
  id?: string;
}

const PER_PAGE = 20;

const sendMessage: MutationFunction<any, ChatMessage> = async message => {
  console.log('final', message);
  const docRef = firestore()
    .collection(`Chats/${message.roomId}/messages`)
    .doc();
  await docRef.set({
    ...message,
    id: docRef.id,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

const getMessages: QueryFunction<ChatMessage[]> = async key => {
  const roomId = key.queryKey[1];

  const snapshot = await firestore()
    .collection(`Chats/${roomId}/messages`)
    .orderBy('createdAt', 'desc')
    .limit(PER_PAGE)
    .get();
  const retMessage: ChatMessage[] = [];
  for (const message of snapshot.docs) {
    const data = message.data() as any;
    retMessage.push({...data, createdAt: data.createdAt.toDate()});
  }
  return retMessage;
};

const attachMessageListener = (key: QueryKey): (() => void) => {
  const roomId = key[1];
  return firestore()
    .collection(`Chats/${roomId}/messages`)
    .orderBy('createdAt', 'desc')
    .where('createdAt', '>', new Date())
    .onSnapshot(snap => {
      const changes = snap.docChanges();
      for (const change of changes) {
        if (change.type === 'added') {
          const data = change.doc.data();
          const message = {
            ...data,
            createdAt: data.createdAt.toDate(),
          } as ChatMessage;
          addMessageToQueryCache(key, message);
        }
      }
    });
};

const addMessageToQueryCache = (key: QueryKey, message: ChatMessage) => {
  const cache = queryClient.getQueryData<InfiniteData<ChatMessage[]>>(key);
  const messages = spreadArray(cache?.pages);
  messages.unshift(message);

  const newData: ChatMessage[][] = [];
  for (let i = 0; i < messages.length; i += PER_PAGE) {
    const currentPage = messages.slice(i, i + PER_PAGE);
    newData.push(currentPage);
  }

  queryClient.setQueryData<InfiniteData<ChatMessage[]>>(key, data => {
    return {
      pageParams: data?.pageParams || [],
      pages: newData,
    };
  });
};

export const chatService = {
  sendMessage,
  getMessages,
  attachMessageListener,
};
