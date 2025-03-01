import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import colors from "../utils/colors";
import ColorPicker from "../components/ColorPicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "../utils/SupaBaseConfig";
import { auth } from "../configs/FirebaseConfig";
import { useRouter } from "expo-router";

export default function addNewCategory() {
  const [selectedIcon, setSelectedIcon] = useState("😉");
  const [selectedColor, setSelectedColor] = useState(colors.PRIMARY);
  const [categoryName, setCategoryName] = useState();
  const [totalBudget, setTotalBudget] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onCreateCategory = async () => {
    setLoading(true);

    // Validate if the amount is a positive number
    if (parseFloat(totalBudget) <= 0 || isNaN(parseFloat(totalBudget))) {
      ToastAndroid.show("Amount must be a positive number", ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        console.error("User is not logged in or email is missing");
        ToastAndroid.show(
          "Please log in to create a category",
          ToastAndroid.SHORT
        );
        return;
      }

      const { data, error } = await supabase
        .from("category")
        .insert([
          {
            name: categoryName,
            assign_budget: totalBudget,
            icon: selectedIcon,
            color: selectedColor,
            created_by: user.email,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating category:", error.message);
        ToastAndroid.show("Error creating category", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      if (data) {
        console.log("Category Data:", data);
        router.replace({
          pathname: "/category-details",
          params: {
            categoryId: data[0].id,
          },
        });
        setLoading(false);
        ToastAndroid.show("Category Created!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TextInput
          style={[
            styles.iconInput,
            { backgroundColor: selectedColor, textAlign: "center" },
          ]}
          maxLength={2}
          onChangeText={(value) => {
            setSelectedIcon(value);
          }}
        >
          {selectedIcon}
        </TextInput>
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={(color) => {
            setSelectedColor(color);
          }}
        />
      </View>

      {/* Add category name and total budget section */}

      <View style={styles.inputView}>
        <MaterialIcons name="local-offer" size={24} color={colors.WHITE2} />
        <TextInput
          placeholder="Category Name"
          onChangeText={(value) => setCategoryName(value)}
          style={styles.inputText}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputView}>
        <FontAwesome name="rupee" size={24} color={colors.WHITE2} />
        <TextInput
          placeholder="Total Budget"
          onChangeText={(value) => setTotalBudget(value)}
          keyboardType="numeric"
          style={styles.inputText}
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        disabled={!categoryName || !totalBudget || loading}
        onPress={() => onCreateCategory()}
      >
        {loading ? (
          <ActivityIndicator color={colors.WHITE1} />
        ) : (
          <Text style={styles.btnText}>Create</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconInput: {
    textAlign: "center",
    fontSize: 30,
    padding: 20,
    borderRadius: 99,
    paddingHorizontal: 28,
    color: colors.WHITE1,
  },
  inputView: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    padding: 14,
    borderRadius: 10,
    borderColor: colors.WHITE2,
    backgroundColor: colors.WHITE1,
    alignItems: "center",
    marginTop: 20,
  },
  inputText: {
    width: "85%", // Adjust the width to ensure text fits well
    fontSize: 17,
    color: colors.BLACK1,
    paddingHorizontal: 10,
    paddingVertical: 10, // Prevent text from overflowing vertically
    textAlign: "left", // Ensure text aligns to the left
  },
  btn: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 99,
    marginTop: 30,
  },
  btnText: {
    textAlign: "center",
    fontSize: 18,
    color: colors.WHITE1,
  },
});
