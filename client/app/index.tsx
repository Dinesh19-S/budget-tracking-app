import { View, Text } from 'react-native'
import React from 'react'
import Login from './../components/Login';
import { auth } from './../configs/FirebaseConfig'
import { Redirect } from 'expo-router';

export default function Index() {

  const user = auth.currentUser;

  return (
    <View>
        {user?<Redirect href={'(tabs)'}/>:<Login/>}
    </View>
  )
}