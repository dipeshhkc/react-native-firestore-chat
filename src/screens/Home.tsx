import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({roomId: '', username: ''});
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter roomId and UserName to Join</Text>
      <TextInput
        style={styles.input}
        onChangeText={val => setUser(user => ({...user, roomId: val}))}
        value={user.roomId}
        placeholder="Room ID"
      />
      <TextInput
        style={styles.input}
        onChangeText={val => setUser(user => ({...user, username: val}))}
        value={user.username}
        placeholder="UserName"
      />
      <Button
        title="Join the Chat"
        onPress={() =>
          navigation.navigate('Chat', {
            user,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 20,
    minWidth: 250,
    borderRadius: 5,
  },
  bottom: {
    // paddingHorizontal: 15,
  },
});
