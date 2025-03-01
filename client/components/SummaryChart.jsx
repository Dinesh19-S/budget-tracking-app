import { View, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { supabase } from "./../utils/SupaBaseConfig"; // Import your Supabase client
import colors from "../utils/colors";

export default function SummaryChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const { data, error } = await supabase
          .from("income") // Your Supabase table name
          .select("amount"); // Only fetch the `amount` column

        if (error) {
          console.error("Error fetching income data:", error);
        } else {
          // Format the data for the BarChart
          const formattedData = data.map((item) => ({
            value: item.amount || 0, // Use amount as the bar value
            frontColor: "green", // Always set bar color to green
          }));
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchIncomeData();
  }, []);

  if (loading) {
    return <Text>Loading chart data...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <BarChart
          data={chartData} // Use fetched chart data
          height={180}
          width={290}
          barWidth={18}
          minHeight={10}
          barBorderRadius={3}
          spacing={20}
          noOfSections={2}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{color:colors.WHITE2}}
          yAx
          isAnimated
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
});
