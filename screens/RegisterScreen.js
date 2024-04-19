import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Input, Button } from "react-native-elements";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import firestore from "@react-native-firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

// import { firestore } from "@react-native-firebase/firestore";
const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigation = useNavigation();

  const registerUser = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userUID = userCredential.user.uid;
        const docRef = doc(db, "users", userUID);
        const docSnap = setDoc(docRef, {
          photoURL: avatar
            ? avatar
            : "https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x",
          name: name,
          password: password,
          email: email,
          userUID: userUID,
        })
          .then(() => {
            navigation.navigate("Home");
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
    //   const userId = uuid.v4();
    //   const user = firestore().collection("users");
    //   try {
    //     await user.doc(userId).set({
    //       name: name,
    //       email: email,
    //       password: password,
    //       avatar:
    //         "https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x",
    //       userId: userId,
    //     });
    //     console.log("user created");
    //   } catch (error) {
    //     console.error("Error registering user:", error);
    //   }
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: name,
          photoURL: avatar
            ? avatar
            : "https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x",
        })
          .then(() => {
            // alert("Registered, please login.");
            navigation.navigate("Login");
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Input
        placeholder="Enter your image url"
        label="Profile Picture"
        value={avatar}
        onChangeText={(text) => setAvatar(text)}
      />
      <Button title="register" onPress={registerUser} style={styles.button} />
      <Text onPress={() => navigation.navigate("Login")}>Have an Account </Text>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginTop: 100,
  },
  button: {
    width: 370,
    marginTop: 10,
  },
});
