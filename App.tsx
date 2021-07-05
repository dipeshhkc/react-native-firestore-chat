import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {queryClient} from './src/config/queryClient';
import {Chat} from './src/screens/Chat';
import {Home} from './src/screens/Home';
import {User} from './src/service/chat';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={({route}) => {
                const {user} = route.params as {user: User};
                return {
                  title: user.roomId || 'Chat Room',
                  headerStyle: {
                     height: 80,
                     borderBottomLeftRadius:30,
                     borderBottomRightRadius:30,
                  },
                };
              }}
            />
          </Stack.Navigator>
        </QueryClientProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
