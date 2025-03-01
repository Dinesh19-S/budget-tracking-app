import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../utils/SupaBaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import CourseInfo from "../components/category details/CourseInfo";
import CourseItemList from "../components/category details/CourseItemList";
import colors from "../utils/colors";

export default function CategoryDetails() {
  const { categoryId } = useLocalSearchParams();
  const [categoryData, setcategoryData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    console.log("ID :", categoryId);
    categoryId && getCategoryDetail();
  }, [categoryId]);

  const getCategoryDetail = async () => {
    const { data, error } = await supabase
      .from("category")
      .select("*,categoryItems(*)")
      .eq("id", categoryId);
    setcategoryData(data[0]);
    console.log("category : ", data);
  };
  return (
    <View
      style={{
        padding: 20,
        marginTop: 5,
        position: "relative",
        flex: 1,
        backgroundColor: colors.WHITE1,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back-circle-sharp" size={44} color="black" />
        </TouchableOpacity>
        <CourseInfo categoryData={categoryData}></CourseInfo>
        <CourseItemList
          categoryData={categoryData}
          setUpdateRecord={() => getCategoryDetail()}
        />
      </ScrollView>
      <Link
        href={{
          pathname: "/add-new-category-item",
          params: {
            categoryId: categoryData.id,
          },
        }}
        style={styles.floatingBtn}
      >
        <Ionicons name="add-circle-sharp" size={60} color={colors.PRIMARY} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  textIcon: {
    fontSize: 20,
  },
  floatingBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
