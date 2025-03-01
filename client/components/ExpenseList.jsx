import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { auth } from "../configs/FirebaseConfig";
import { supabase } from "../utils/SupaBaseConfig";
import colors from "../utils/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseList() {
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandItem, setExpandItem] = useState(null);

  const getExpenseList = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) {
        console.error("User not authenticated or email missing");
        return;
      }

      const { data, error } = await supabase
        .from("expense")
        .select("*")
        .eq("created_by", user.email);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }

      setExpenseList(data || []);
    } catch (error) {
      console.error("Error fetching expense list:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = async (id) => {
    try {
      const { error } = await supabase.from("expense").delete().eq("id", id);
      if (!error) {
        ToastAndroid.show("Expense Deleted!", ToastAndroid.SHORT);
        setExpandItem(null); // Close expanded panel after deletion
        getExpenseList(); // Refresh the list
      } else {
        console.error("Error deleting expense:", error.message);
      }
    } catch (error) {
      console.error("Error during delete operation:", error.message);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDeleteItem(id), style: "destructive" },
      ]
    );
  };

  useEffect(() => {
    getExpenseList();
  }, []);

  return (
    <View style={{ marginTop: 15 }}>
      <View>
        {expenseList.length > 0 ? (
          expenseList.map((expense, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.container,
                  expandItem === index && { backgroundColor: "#f0f0f0" },
                ]}
                onPress={() =>
                  setExpandItem(expandItem === index ? null : index)
                }
              >
                <View style={styles.topDetailsPart}>
                  <Text style={{ color: "#A9A9A9" }}>{expense.category}</Text>
                  <Text style={{ color: "#A9A9A9" }}>
                    {expense.date.substring(0, 10)}
                  </Text>
                </View>
                <View style={styles.wrapper}>
                  <View style={styles.subContainer}>
                    <Text style={styles.expenseText}>{expense.name}</Text>
                  </View>
                  <Text style={styles.totalAmountText}>
                    <FontAwesome
                      name="rupee"
                      size={15}
                      color={colors.BLACK1}
                    />{" "}
                    {expense.amount}
                  </Text>
                </View>
              </TouchableOpacity>
              {expandItem === index && (
                <View style={styles.actionItemContainer}>
                  <TouchableOpacity onPress={() => confirmDelete(expense.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              {expenseList.length - 1 !== index && (
                <View
                  style={{
                    marginVertical: 5,
                  }}
                ></View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>No Items found</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
    display: "flex",
    alignItems: "center",
    backgroundColor: colors.LIGHT_RED,
    paddingVertical: 5,
    borderRadius: 5,
  },
  wrapper: {
    gap: 7,
    display: "flex",
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expenseText: {
    fontFamily: "Montserrat-medium",
    fontSize: 16,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  totalAmountText: {
    fontFamily: "Montserrat-bold",
    fontSize: 15,
  },
  topDetailsPart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  placeholder: {
    fontFamily: "Montserrat-bold",
    fontSize: 20,
    color: colors.WHITE2,
  },
  actionItemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    justifyContent: "flex-end",
    marginTop: 10,
    marginRight: 10,
  },
});
