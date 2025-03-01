import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";
import colors from "../../../utils/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please Enter Email & Password", ToastAndroid.BOTTOM);
      return;
    }

    if (!email.includes("@")) {
      ToastAndroid.show("Please enter a valid email", ToastAndroid.BOTTOM);
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.replace("/(tabs)");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        if (errorCode == "auth/invalid-credential") {
          ToastAndroid.show("Invalid credentials", ToastAndroid.LONG);
        }
      });
  };

  return (
    <KeyboardAvoidingView>
      <StatusBar style="auto" />
      <ScrollView
        style={{
          padding: 25,
          paddingTop: 40,
          backgroundColor: colors.WHITE1,
          height: "100%",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Montserrat-bold",
            fontSize: 30,
            marginTop: 30,
          }}
        >
          Let's Sign You In
        </Text>
        <Text
          style={{
            fontFamily: "Montserrat",
            fontSize: 30,
            marginTop: 20,
            color: colors.WHITE2,
          }}
        >
          Welcome Back
        </Text>
        <Text
          style={{
            fontFamily: "Montserrat",
            fontSize: 30,
            color: colors.WHITE2,
            marginTop: 10,
          }}
        >
          You've been missed!
        </Text>

        {/* Email */}
        <View
          style={{
            marginTop: 50,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
            }}
          >
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(value) => setEmail(value)}
          />
        </View>

        {/* Password */}
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
            }}
          >
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter Password"
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={onSignIn}
          style={{
            padding: 20,
            backgroundColor: colors.PRIMARY,
            borderRadius: 15,
            marginTop: 50,
          }}
        >
          <Text
            style={{
              color: colors.WHITE1,
              textAlign: "center",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => router.replace("auth/sign-up")}
          style={{
            padding: 20,
            backgroundColor: colors.WHITE1,
            borderRadius: 15,
            marginTop: 20,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: colors.PRIMARY,
              textAlign: "center",
            }}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.WHITE2,
    fontFamily: "Montserrat",
  },
});
