import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import colors from "../../utils/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Header from "../../components/Header";
import MoneyStatus from "../../components/MoneyStatus";
import Ionicons from "@expo/vector-icons/Ionicons";
import IncomeExpenseList from "../../components/IncomeExpenseList";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Tracks delete or update events
  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger data refresh
    setRefreshing(false); // End refreshing state
  };

  const handleDelete = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh after delete
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <Header refreshing={refreshTrigger} />
      </SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <MoneyStatus refreshing={refreshTrigger} />
          <View style={styles.incomeExpenseContainer}>
            <IncomeExpenseList onDelete={handleDelete} />
          </View>
          <Link href={"/add-income-expense"} style={styles.addBtnContainer}>
            <Ionicons
              name="add-circle-sharp"
              size={65}
              color={colors.PRIMARY}
            />
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.WHITE1,
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: colors.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE1,
  },
  addBtnContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  incomeExpenseContainer: {
    marginTop: 30,
  },
});
