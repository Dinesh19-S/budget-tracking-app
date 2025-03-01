import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Alert,
} from "react-native";
import { auth } from "../configs/FirebaseConfig";
import { supabase } from "../utils/SupaBaseConfig";
import colors from "../utils/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

export default function IncomeList() {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandItem, setExpandItem] = useState(null);

  const getIncomeList = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) {
        console.error("User not authenticated or email missing");
        return;
      }

      const { data, error } = await supabase
        .from("income")
        .select("*")
        .eq("created_by", user.email);

      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }

      setIncomeList(data || []);
    } catch (error) {
      console.error("Error fetching income list:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = async (id) => {
    try {
      const { error } = await supabase.from("income").delete().eq("id", id);
      if (!error) {
        ToastAndroid.show("Income Deleted!", ToastAndroid.SHORT);
        setExpandItem(null); // Close expanded panel after deletion
        getIncomeList(); // Refresh the list
      } else {
        console.error("Error deleting income:", error.message);
      }
    } catch (error) {
      console.error("Error during delete operation:", error.message);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Income",
      "Are you sure you want to delete this income?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDeleteItem(id), style: "destructive" },
      ]
    );
  };

  useEffect(() => {
    getIncomeList();
  }, []);

  return (
    <View style={{ marginTop: 15 }}>
      <View>
        {incomeList.length > 0 ? (
          incomeList.map((income, index) => (
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
                  <Text style={{ color: "#A9A9A9" }}>{income.category}</Text>
                  <Text style={{ color: "#A9A9A9" }}>
                    {income.date.substring(0, 10)}
                  </Text>
                </View>
                <View style={styles.wrapper}>
                  <View style={styles.subContainer}>
                    <Text style={styles.incomeText}>{income.name}</Text>
                  </View>
                  <Text style={styles.totalAmountText}>
                    <FontAwesome
                      name="rupee"
                      size={15}
                      color={colors.BLACK1}
                    />{" "}
                    {income.amount}
                  </Text>
                </View>
              </TouchableOpacity>
              {expandItem === index && (
                <View style={styles.actionItemContainer}>
                  <TouchableOpacity onPress={() => confirmDelete(income.id)}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              {incomeList.length - 1 !== index && (
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
    backgroundColor: colors.LIGHT_GREEN,
    padding: 5,
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
  incomeText: {
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
    marginVertical:5,
    marginRight: 10,
  },
});
