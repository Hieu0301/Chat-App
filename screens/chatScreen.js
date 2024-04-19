import React, {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { GiftedChat } from "react-native-gifted-chat";
import { AntDesign } from '@expo/vector-icons';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  firestore,
} from "firebase/firestore";

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  const signOutNow = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 30 }}>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={signOutNow}
        >
          <Text>Đăng xuất</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(db, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot unsubcribe");

      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = useCallback((messages = []) => {
    const newMessage = messages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
    const { _id, createdAt, text, user } = messages[0];

    addDoc(collection(db, "chats"), { _id, createdAt, text, user });
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL,
        }}
      />
    </View>
  );
};

export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
  },
});
