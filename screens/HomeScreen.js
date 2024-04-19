import {
  Button,
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
import ListItem from "../component/ListItem";
import Users from "../tabs/Users";
import Setting from "../tabs/Setting";
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedtab] = useState(0);
  const navigation = useNavigation();

  const getUsers = async () => {
    const docsRef = collection(db, "users");
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



  return (
    <View style={styles.container}>
      {selectedTab == 0 ? <Users /> : <Setting />}
      <Button title="Create new Group" />
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setSelectedtab(0);
          }}
        >
          <View>
            <Ionicons name="person-sharp" size={30} color="black" />
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            navigation.navigate("GroupScreen"); // Điều hướng tới màn hình "Groupscreen"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <FontAwesome name="group" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "purple",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
});
