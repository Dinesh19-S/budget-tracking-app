import React, { useState, useEffect, useCallback, memo } from "react";
import { View, SafeAreaView, StyleSheet, Modal, Share } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Button,
  TextInput,
} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "./../../configs/FirebaseConfig.jsx";
import { supabase } from "../../utils/SupaBaseConfig.jsx";
import colors from "../../utils/colors";
import files from "./../../assets/filesBase64";

const EditModal = memo(
  ({ isVisible, onClose, userData, onUpdateData, onSave, onImagePick }) => (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <Title style={styles.modalTitle}>Edit Profile</Title>

        <TouchableRipple onPress={onImagePick} style={styles.imagePickerButton}>
          <View style={styles.centered}>
            <Avatar.Image source={{ uri: userData.profile_pic }} size={100} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </View>
        </TouchableRipple>

        <TextInput
          label="Name"
          value={userData.name}
          onChangeText={(text) => onUpdateData("name", text)}
          style={styles.input}
        />
        <TextInput
          label="Username"
          value={userData.user_name}
          onChangeText={(text) => onUpdateData("user_name", text)}
          style={styles.input}
        />
        <TextInput
          label="Location"
          value={userData.location}
          onChangeText={(text) => onUpdateData("location", text)}
          style={styles.input}
        />
        <TextInput
          label="Phone"
          value={userData.phone}
          onChangeText={(text) => onUpdateData("phone", text)}
          style={styles.input}
        />

        <View style={styles.modalButtons}>
          <Button onPress={onClose} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" onPress={onSave} style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </Modal>
  )
);

const MenuSection = memo(({ onShare }) => (
  <View style={styles.menuWrapper}>
    <TouchableRipple onPress={() => {}}>
      <View style={styles.menuItem}>
        <MaterialCommunityIcons
          name="heart-outline"
          color={colors.PRIMARY}
          size={25}
        />
        <Text style={styles.menuItemText}>Your Favorites</Text>
      </View>
    </TouchableRipple>
    <TouchableRipple onPress={onShare}>
      <View style={styles.menuItem}>
        <MaterialCommunityIcons
          name="share-outline"
          color={colors.PRIMARY}
          size={25}
        />
        <Text style={styles.menuItemText}>Tell Your Friends</Text>
      </View>
    </TouchableRipple>
    <TouchableRipple onPress={() => {}}>
      <View style={styles.menuItem}>
        <MaterialCommunityIcons
          name="account-check-outline"
          color={colors.PRIMARY}
          size={25}
        />
        <Text style={styles.menuItemText}>Support</Text>
      </View>
    </TouchableRipple>
  </View>
));

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    user_name: "",
    location: "",
    phone: "",
    profile_pic:
      "https://cdn.vectorstock.com/i/preview-1x/15/32/colorful-profile-picture-placeholder-icon-vector-42411532.jpg",
    email: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("email", auth.currentUser.email)
        .single();

      if (error) throw error;
      if (data) setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUserData = async (newData) => {
    try {
      const { data: userData, error: fetchError } = await supabase
        .from("user")
        .select("id")
        .eq("email", auth.currentUser.email)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("user")
        .update(newData)
        .eq("id", userData.id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  const handleUpdateData = useCallback((field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        const fileExt = file.uri.substring(file.uri.lastIndexOf(".") + 1);
        const fileName = `${auth.currentUser.uid}.${fileExt}`;
        const filePath = `${fileName}`;

        const response = await fetch(file.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, blob, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        setUserData((prev) => ({ ...prev, profile_pic: publicUrl }));
        await updateUserData({ profile_pic: publicUrl });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await updateUserData({
        name: userData.name,
        user_name: userData.user_name,
        location: userData.location,
        phone: userData.phone,
        profile_pic: userData.profile_pic,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, [userData]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message:
          "Order your next meal from FoodFinder App. I've already ordered more than 10 meals on it.",
        url: files.appLogo,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <EditModal
        isVisible={isEditing}
        onClose={() => setIsEditing(false)}
        userData={userData}
        onUpdateData={handleUpdateData}
        onSave={handleSave}
        onImagePick={pickImage}
      />

      <View style={styles.userInfoSection}>
        <View style={styles.profileHeader}>
          <Avatar.Image
            source={{
              uri:
                userData.profile_pic ||
                "https://cdn.vectorstock.com/i/preview-1x/15/32/colorful-profile-picture-placeholder-icon-vector-42411532.jpg",
            }}
            size={80}
          />
          <View style={styles.userInfo}>
            <Title style={styles.title}>{userData.name || "User"}</Title>
            <Caption style={styles.caption}>
              {userData.user_name || "@user"}
            </Caption>
          </View>
          <TouchableRipple
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <MaterialCommunityIcons
              name="account-edit"
              size={35}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            color="#777777"
            size={20}
          />
          <Text style={styles.infoText}>{userData.location || "Not set"}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="phone" color="#777777" size={20} />
          <Text style={styles.infoText}>{userData.phone || "Not set"}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name="email" color="#777777" size={20} />
          <Text style={styles.infoText}>
            {userData.email || auth.currentUser.email}
          </Text>
        </View>
      </View>

      <MenuSection onShare={handleShare} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  editButton: {
    padding: 5,
    backgroundColor: colors.WHITE2,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  infoText: {
    color: "#777777",
    marginLeft: 20,
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 50,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    width: "40%",
  },
  imagePickerButton: {
    marginBottom: 20,
  },
  centered: {
    alignItems: "center",
  },
  changePhotoText: {
    marginTop: 10,
    color: colors.PRIMARY,
  },
});
