import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../utils/colors";
import PieChart from "react-native-pie-chart";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CircularChart({ categoryList = [] }) {
  const widthAndHeight = 150;
  const [values, setValues] = useState([1]);
  const [sliceColor, setSliceColor] = useState([colors.WHITE2]);
  const [totalCalculatedEstimate, setTotalCalculatedEstimate] = useState(0);

  useEffect(() => {
    updateCircularChart();
  }, [categoryList]); // Trigger when categoryList changes

  const updateCircularChart = () => {
    let totalEstimates = 0;
    let chartValues = [];
    let chartColors = [];
    let otherCost = 0;

    categoryList.forEach((item, index) => {
      if (index < 4) {
        const itemTotalCost = item.categoryItems?.reduce(
          (sum, subItem) => sum + (subItem.cost || 0),
          0
        );
        totalEstimates += itemTotalCost;
        chartValues.push(itemTotalCost);
        chartColors.push(colors.COLOR_LIST[index]);
      } else {
        const itemOtherCost = item.categoryItems?.reduce(
          (sum, subItem) => sum + (subItem.cost || 0),
          0
        );
        otherCost += itemOtherCost;
        totalEstimates += itemOtherCost;
      }
    });

    if (otherCost > 0) {
      chartValues.push(otherCost);
      chartColors.push(colors.COLOR_LIST[4]);
    }

    if (chartValues.length === 0 || chartValues.every((val) => val === 0)) {
      chartValues = [1]; // Default fallback value
      chartColors = [colors.WHITE2];
    }

    // Only update state if values actually change
    setValues((prevValues) =>
      JSON.stringify(prevValues) !== JSON.stringify(chartValues)
        ? chartValues
        : prevValues
    );
    setSliceColor((prevColors) =>
      JSON.stringify(prevColors) !== JSON.stringify(chartColors)
        ? chartColors
        : prevColors
    );
    setTotalCalculatedEstimate((prevTotal) =>
      prevTotal !== totalEstimates ? totalEstimates : prevTotal
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalEstimate}>
        Total Estimate:{" "}
        <Text style={styles.boldText}>
          <FontAwesome name="rupee" size={18} color={colors.BLACK1} /> {totalCalculatedEstimate.toFixed(2)}
        </Text>
      </Text>
      <View style={styles.subContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values}
          sliceColor={sliceColor}
          coverRadius={0.65}
          coverFill={colors.WHITE1}
        />
        {categoryList.length === 0 ? (
          <View style={styles.pieStatus}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={24}
              color={colors.WHITE2}
            />
            <Text>NA</Text>
          </View>
        ) : (
          <View>
            {categoryList.map((category, index) =>
              index < 4 ? (
                <View key={index} style={styles.pieStatus}>
                  <MaterialCommunityIcons
                    name="checkbox-blank-circle"
                    size={24}
                    color={colors.COLOR_LIST[index]}
                  />
                  <Text style={styles.categoryText} numberOfLines={1}>
                    {category.name}
                  </Text>
                </View>
              ) : null
            )}
            {values.length > 4 && (
              <View style={styles.pieStatus}>
                <MaterialCommunityIcons
                  name="checkbox-blank-circle"
                  size={24}
                  color={colors.COLOR_LIST[4]}
                />
                <Text style={styles.categoryText} numberOfLines={1}>
                  Others
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: colors.WHITE1,
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  subContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pieStatus: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  totalEstimate: {
    fontSize: 20,
    fontFamily: "Montserrat",
  },
  boldText: {
    fontFamily: "Montserrat-bold",
  },
  categoryText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    width: 100, // Limit the width of category text
    overflow: "hidden", // Prevent overflow
    textOverflow: "ellipsis", // Add ellipsis for overflow text
    whiteSpace: "nowrap", // Prevent text from wrapping
  },
});
