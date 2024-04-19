import {
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import AsyncStorage, {
  AsynStorage,
} from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const getUsers = async () => {
    const docsRef = collection(db, "users");
    const userUID = await AsyncStorage.getItem("userUID");
    const q = query(docsRef, where("userUID", "!=", auth?.currentUser?.uid));
    const docSnap = onSnapshot(q, (onSnap) => {
      let data = [];
      onSnap.docs.forEach((user) => {
        data.push({ ...user.data() });
        setUsers(data);
        console.log(user.data());
      });
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const renderImage = () => {};
  return (
    <View style={styles.container}>
      {/* <Button title="logout" onPress={() => navigation.navigate("Login")} /> */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Xin chao {auth?.currentUser?.email} !!!
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => navigation.navigate("ChatScreen", { data: item })}
            >
              <Image
                source={{ uri: item.photoURL }}
                // source={require("../images/user.png")}
                style={styles.userIcon}
              ></Image>
              <View style={styles.itemAll}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "purple",
    fontSize: 20,
    fontWeight: "600",
  },
  userItem: {
    width: Dimensions.get("window").width - 50,
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: "center",
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  itemName: {
    color: "black",
    fontSize: 16,
    marginLeft: 20,
    flexDirection: "column",
  },
  itemEmail: {
    flexDirection: "row",
    fontSize: 20,
    marginLeft: 20,
  },
  itemAll: {
    flexDirection: "column",
  },
});
