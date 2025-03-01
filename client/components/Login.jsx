import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import loginBG from "./../assets/images/illu_removedBG-min.png";
import colors from "./../utils/colors";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const router = useRouter();
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image source={loginBG} style={styles.illustrator} />

        <View style={styles.background}>
          <Text style={styles.textHeading}>Personal Budget Planner</Text>
          <Text style={styles.textSubHeading}>
            Every Expense Counts, Every Savings Matter.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("auth/sign-in")}
          >
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

// Styles for the above components using StyleSheet from react-native

const styles = StyleSheet.create({
  illustrator: {
    width: "100%",
    height: 270,
    marginTop: 150,
  },
  background: {
    backgroundColor: colors.PRIMARY,
    width: "100%",
    height: "100%",
    padding: 20,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textHeading: {
    fontSize: 35,
    fontFamily: "Montserrat-bold",
    textAlign: "center",
    color: colors.WHITE1,
  },
  textSubHeading: {
    fontSize: 16,
    paddingInline: "20",
    fontFamily: "Montserrat",
    color: colors.WHITE1,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.WHITE1,
    padding: 15,
    paddingHorizontal: 5,
    borderRadius: 99,
    marginTop: 80,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  btnText: {
    textAlign: "center",
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 15,
    color: colors.PRIMARY,
  },
});
