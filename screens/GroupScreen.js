import React, { useState, useEffect } from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from "react-native";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

const GroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "groups"), (snapshot) => {
      const updatedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(updatedGroups);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateNewGroup = async () => {
    try {
      const docRef = await addDoc(collection(db, "groups"), { name: groupName });
      setGroupName("");
      textInputRef.blur();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleGroupPress = (groupId) => {
    navigation.navigate("GroupChatScreen", { groupId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupSection}>
        <Text style={styles.title}>Tạo nhóm chat mới</Text>
        <TextInput
          ref={(ref) => {
            textInputRef = ref;
          }}
          style={styles.input}
          placeholder="Nhập tên nhóm"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateNewGroup}
        >
          <Text style={styles.buttonText}>Tạo nhóm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.groupItem}
            onPress={() => handleGroupPress(item.id)}
          >
            <Text style={styles.groupName}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  groupItem: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2, // Hiệu ứng đổ bóng
    shadowColor: '#000000', // Màu bóng đổ
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    fontWeight: 'bold',
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  groupSection: {
    marginBottom: 20, // Khoảng cách giữa phần tạo nhóm và danh sách nhóm
  },
});

export default GroupScreen;
