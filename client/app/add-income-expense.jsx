import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import colors from "../utils/colors";
import Income from "../components/Income";
import Expense from "../components/Expense";

export default function addIncomeExpense() {
  const [selectedForm, setSelectedForm] = useState("expense");
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.expenseBtn}
          onPress={() => setSelectedForm("expense")}
        >
          <Text style={styles.btnTxt}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.incomeBtn}
          onPress={() => setSelectedForm("income")}
        >
          <Text style={styles.btnTxt}>Income</Text>
        </TouchableOpacity>
      </View>
      {selectedForm == "expense" ? <Expense /> : <Income />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE1,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  incomeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.GREEN,
    borderRadius: 5,
    flex: 1,
  },
  expenseBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.RED,
    borderRadius: 5,
    flex: 1,
  },
  btnTxt: {
    textAlign: "center",
    fontFamily: "Montserrat-bold",
    fontSize: 16,
    color: colors.WHITE1,
  },
});
