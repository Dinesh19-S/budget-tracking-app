import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import React from "react";
import colors from "../utils/colors";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CategoryList({ categoryList }) {
  const router = useRouter();

  const onCategoryClick = (category) => {
    router.push({
      pathname: "/category-details",
      params: {
        categoryId: category.id,
      },
    });
  };

  const calculateTotalCost = (categoryItems) => {
    let totalCost = 0;
    categoryItems.forEach((item) => {
      totalCost = totalCost + item.cost;
    });
    return totalCost;
  };

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Text style={styles.headerText}>Latest Budget</Text>
      <ScrollView>
        {categoryList &&
          categoryList?.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.container}
              onPress={() => onCategoryClick(category)}
            >
              <View style={styles.iconContainer}>
                <Text
                  style={[styles.iconText, { backgroundColor: category?.color }]}
                  numberOfLines={1} // Ensure icon text doesn't overflow
                >
                  {category.icon}
                </Text>
              </View>
              <View style={styles.subContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.categoryText} numberOfLines={2}>
                    {category.name}
                  </Text>
                  <Text style={styles.itemCount} numberOfLines={1}>
                    {category?.categoryItems?.length} Items
                  </Text>
                </View>
                <Text style={styles.totalAmountText}>
                  <FontAwesome name="rupee" size={15} color={colors.BLACK1} />{" "}
                  {calculateTotalCost(category?.categoryItems)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.WHITE1,
    padding: 10,
    borderRadius: 15,
    flexWrap: "wrap", // Ensures content wraps on smaller screens
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "baseline",
  },
  iconText: {
    fontSize: 35,
    padding: 15,
    borderRadius: 15,
    overflow: "hidden", // Prevents the icon from overflowing
  },
  headerText: {
    fontFamily: "Montserrat-bold",
    fontSize: 25,
    marginBottom: 10,
    textAlign: "left",
  },
  categoryText: {
    fontFamily: "Montserrat-bold",
    fontSize: 18,
    flexWrap: "wrap", // Wrap text if it's too long
    maxWidth: 200, // Control max width of the text container
  },
  itemCount: {
    fontFamily: "Montserrat",
    color: colors.GRAY,
    fontSize: 14,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
  totalAmountText: {
    fontFamily: "Montserrat-bold",
    fontSize: 15,
    textAlign: "right", // Aligns the total cost to the right
  },
});
