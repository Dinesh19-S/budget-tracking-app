import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./../../configs/FirebaseConfig.jsx";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../utils/SupaBaseConfig";
import colors from "../../utils/colors";
import services from "../../utils/services";

import Ionicons from "@expo/vector-icons/Ionicons";

import CircularChart from "../../components/CircularChart.jsx";
import CategoryList from "../../components/CategoryList.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [categoryList, setcategoryList] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkUserAuth();
    getCategoryList();
  }, []);

  const checkUserAuth = async () => {
    const result = await services.getData("login");
    if (result !== "true") {
      router.replace("../../components/Login.jsx");
    }
  };

  const handleLogout = async () => {
    try {
      // Call Firebase's signOut function
      await signOut(auth);

      // Perform additional cleanup or actions
      await services.storeData("login", "false"); // Storing the logged-out state
      const router = useRouter(); // Initialize the router
      router.replace("../../components/Login.jsx"); // Redirect to the login page
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const getCategoryList = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) {
        console.error("User not authenticated or email missing");
        return;
      }
      const { data, error } = await supabase
        .from("category")
        .select("*,categoryItems(*)")
        .eq("created_by", user.email);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }
      console.log("Category Data:", data);
      setcategoryList(data);
      data && setLoading(false);
    } catch (error) {
      console.error("Error fetching category list:", error.message);
    }
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getCategoryList()}
            refreshing={loading}
          />
        }
      >
        <SafeAreaView backgroundColor={colors.PRIMARY}>
          <View style={styles.container}>{/* <Header /> */}</View>
        </SafeAreaView>
        <View
          style={{
            padding: 20,
            marginTop: -150,
          }}
        >
          <CircularChart categoryList={categoryList} />
          <CategoryList categoryList={categoryList} />
        </View>
      </ScrollView>
      <Link href={"/add-new-category"} style={styles.addBtnContainer}>
        <Ionicons name="add-circle-sharp" size={65} color={colors.PRIMARY} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    padding: 25,
    backgroundColor: colors.PRIMARY,
    height: 200,
  },
  addBtnContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
});
