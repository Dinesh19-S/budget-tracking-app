import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import colors from "../utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/SupaBaseConfig";
import { decode } from "base64-arraybuffer";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddNewCategoryItem() {
  const placeholder =
    "https://th.bing.com/th/id/OIP.kEKWG9WO-kIzLXqm6_khxgHaFS?rs=1&pid=ImgDetMain";
  const [image, setImage] = useState(placeholder);
  const [previewImage, setPreviewImage] = useState(placeholder);
  const { categoryId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [URL, setURL] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(result.assets[0].base64);
    }
  };

  const onClickAdd = async () => {
    setLoading(true);
    // Validate if the amount is a positive number
    if (parseFloat(cost) <= 0 || isNaN(parseFloat(cost))) {
      ToastAndroid.show("Amount must be a positive number", ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    const fileName = Date.now();
    // Remove base64 prefix if present
    const base64Image = image.startsWith("data:image/")
      ? image.split(",")[1]
      : image;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName + ".png", decode(base64Image), {
        contentType: "image/png",
      });

    if (uploadData) {
      const fileUrl =
        "https://xxajwaqvwtixcnmlxncn.supabase.co/storage/v1/object/public/images/" +
        fileName +
        ".png";

      const { data, error } = await supabase.from("categoryItems").insert([
        {
          name: name,
          cost: cost,
          url: URL,
          image: fileUrl,
          note: note,
          category_id: categoryId,
        },
      ]);
      setLoading(false);
      if (!error) {
        ToastAndroid.show("New Item Added!!", ToastAndroid.SHORT);
        router.push({
          pathname: "/category-details",
          params: {
            categoryId: categoryId,
          },
        });
      } else {
        console.error("Error adding item:", error.message);
        ToastAndroid.show("Failed to add item!", ToastAndroid.SHORT);
      }
    } else {
      console.error("Upload Error:", uploadError.message);
      ToastAndroid.show("Failed to upload image!", ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => onImagePick()}>
          <Image source={{ uri: previewImage }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <Ionicons name="pricetag" size={24} color={colors.WHITE2} />
          <TextInput
            placeholder="Item name"
            style={styles.input}
            onChangeText={(value) => setName(value)}
            multiline={true}
            numberOfLines={3}
          />
        </View>
        <View style={styles.textInputContainer}>
          <FontAwesome name="rupee" size={24} color={colors.WHITE2} />
          <TextInput
            placeholder="Cost"
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(value) => setCost(value)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="link" size={24} color={colors.WHITE2} />
          <TextInput
            placeholder="URL"
            style={styles.input}
            onChangeText={(value) => setURL(value)}
            multiline={true}
            numberOfLines={3}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="clipboard" size={24} color={colors.WHITE2} />
          <TextInput
            placeholder="Note"
            style={styles.input}
            onChangeText={(value) => setNote(value)}
            multiline={true}
            numberOfLines={3}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onClickAdd()}
          disabled={!name || !cost || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.WHITE1} />
          ) : (
            <Text style={styles.addButtonText}>Add Item</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    backgroundColor: colors.WHITE2,
    borderRadius: 15,
  },
  container: {
    padding: 20,
    backgroundColor: colors.WHITE1,
    minHeight: "100%",
  },
  textInputContainer: {
    padding: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    borderColor: colors.WHITE2,
    marginTop: 10,
  },
  input: {
    width: "85%", // Adjust the width to ensure text fits well
    fontSize: 17,
    color: colors.BLACK1,
    paddingHorizontal: 10,
    paddingVertical: 10, // Prevent text from overflowing vertically
    textAlign: "left", // Ensure text aligns to the left
  },
  addButton: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 99,
    textAlign: "center",
    marginTop: 40,
  },
  addButtonText: {
    textAlign: "center",
    fontFamily: "Montserrat-bold",
    fontSize: 20,
    color: colors.WHITE1,
  },
});
