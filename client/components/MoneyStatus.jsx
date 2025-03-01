import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "../utils/SupaBaseConfig";
import colors from "../utils/colors";

export default function MoneyStatus({ refreshing }) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchTotals = async () => {
    try {
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("amount");

      if (incomeError) throw incomeError;

      const incomeTotal = incomeData.reduce((sum, record) => sum + record.amount, 0);
      setTotalIncome(incomeTotal);

      const { data: expenseData, error: expenseError } = await supabase
        .from("expense")
        .select("amount");

      if (expenseError) throw expenseError;

      const expenseTotal = expenseData.reduce((sum, record) => sum + record.amount, 0);
      setTotalExpense(expenseTotal);
    } catch (error) {
      console.error("Error fetching totals:", error.message);
    }
  };

  useEffect(() => {
    fetchTotals(); // Fetch totals when component mounts or `refreshing` changes
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <View style={styles.expenseStatus}>
        <Text style={{ fontFamily: "Montserrat", fontSize: 16 }}>
          My<Text style={{ fontFamily: "Montserrat-bold" }}> Expense</Text>
        </Text>
        <View style={styles.expenseAmt}>
          <FontAwesome name="rupee" size={24} color={colors.RED} />
          <Text style={{ fontSize: 24, color: colors.RED }}>
            {totalExpense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.incomeStatus}>
        <Text style={{ fontFamily: "Montserrat", fontSize: 16, textAlign: "right" }}>
          My<Text style={{ fontFamily: "Montserrat-bold" }}> Income</Text>
        </Text>
        <View style={styles.incomeAmt}>
          <FontAwesome name="rupee" size={24} color={colors.GREEN} />
          <Text style={{ fontSize: 24, color: colors.GREEN }}>
            {totalIncome.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expenseAmt: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  incomeAmt: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
});
