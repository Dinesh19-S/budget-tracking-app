import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";
import colors from "../../../utils/colors";
import { StatusBar } from "expo-status-bar";

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const createAccount = () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show("Please enter all details", ToastAndroid.BOTTOM);
      return;
    }

    if (!email.includes("@")) {
      ToastAndroid.show("Please enter a valid email", ToastAndroid.BOTTOM);
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        router.replace("/(tabs)");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
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
          Create New Account
        </Text>

        {/* User Full Name */}
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
            Full Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            onChangeText={(value) => setFullName(value)}
          />
        </View>

        {/* Email */}
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

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={createAccount}
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
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={() => router.replace("auth/sign-in")}
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
            Sign In
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
