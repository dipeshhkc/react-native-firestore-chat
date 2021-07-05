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
import {TouchableOpacity} from 'react-native-gesture-handler';

export const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({roomId: 'room-1', username: 'dkc'});
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter room and user name to join.</Text>
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
      <View style={styles.button}>
        <Button
          color="#a738d3"
          title="Join the Chat"
          onPress={() =>
            navigation.navigate('Chat', {
              user,
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#eee',
  },
  button: {
    width: '100%',
  },
});
