import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const GroupChatScreen = () => {
    const [userList, setUserList] = useState([]);
    const [isUserListOpen, setIsUserListOpen] = useState(false);

    // Hàm xử lý khi người dùng bấm vào icon thêm hoặc danh sách người dùng
    const handleToggleUserList = async () => {
        if (!isUserListOpen) {
            try {
                // Truy xuất dữ liệu người dùng từ Firebase
                const querySnapshot = await getDocs(collection(db, 'users'));
                const users = [];
                querySnapshot.forEach((doc) => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                // Cập nhật danh sách người dùng
                setUserList(users);
            } catch (error) {
                console.error('Error getting user list: ', error);
            }
        }
        // Đảo ngược trạng thái mở hay đóng danh sách người dùng
        setIsUserListOpen(!isUserListOpen);
    };

    // Hàm xử lý khi người dùng bấm vào nút thêm bên cạnh người dùng
    const handleAddUserToGroup = (userId) => {
        // Viết logic để thêm người dùng vào nhóm ở đây
        console.log('Adding user to group:', userId);
    };

    return (
        <View style={styles.container}>
            {/* Icon thêm */}
            <TouchableOpacity onPress={handleToggleUserList} style={styles.addButton}>
                <AntDesign name="addusergroup" size={30} color="black" />
            </TouchableOpacity>

            {/* Danh sách người dùng */}
            {isUserListOpen && (
                <FlatList
                    data={userList}
                    keyExtractor={(item) => item.userUID}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userItem} onPress={() => handleAddUserToGroup(item.id)}>
                            {/* Hiển thị ảnh đại diện */}
                            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                            {/* View chứa tên người dùng và nút thêm */}
                            <View style={styles.userInfoContainer}>
                                <Text style={styles.userName}>{item.name}</Text>
                                {/* Nút thêm */}
                                <TouchableOpacity onPress={() => handleAddUserToGroup(item.id)} style={styles.addButton}>
                                    <AntDesign name="pluscircleo" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 20,
        marginBottom: 20,
    },
    addButton: {
        marginBottom: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GroupChatScreen;
