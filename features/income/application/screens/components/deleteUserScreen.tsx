import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from 'react-native-paper';
import React, { FC, useEffect, } from "react";
import User from "../../../domain/entities/users";
import { DeleteUserProvider, useDeleteUserState } from "../../providers/deleteUserProvider";

interface UserDeleteViewProps {
  userDelete: User;
  onDeleted: Function;
  closeModal: Function;
  isVisible: boolean;
}

const DeleteUser: React.FC<UserDeleteViewProps> = ({
  userDelete,
  onDeleted,
  closeModal,
  isVisible,
}) => {
  const {
    loading,
    saving,
    success,
    message,
    user,
    errors,

    setUserProp,
    deleteUser,
    setUser,
  } = useDeleteUserState()

  useEffect(() => {
    setUser(userDelete);
  }, [userDelete]);

  const handleDelete = async () => {
    if (deleteUser) {
      deleteUser(() => {
        Alert.alert('Mensaje', 'El usuario ha sido eliminado correctamente', [
          {
            text: 'Muy bien',
            onPress: () => {
              onDeleted(userDelete);
              closeModal(); // Cierra el modal de información
            },
          },
        ]);
      });
    }

    await deleteUser(onDeleted);
    closeModal(); // Asegúrate de cerrar el modal después de la eliminación
  };

  useEffect(() => {
    if (success) {
      if (message) {
        Alert.alert('Usuario Borrado ', message);
      }
      closeModal();
    } else if (message) {
      Alert.alert('Usuario Borrado', message);
    }
  }, [success, message]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        closeModal(null)
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, width: '100%', padding: 5 }}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>¿Quieres Eliminar a {user.name}?</Text>
          </View>
          <View>
            <Button style={styles.button} buttonColor='#f45572' onPress={handleDelete}>
              <Text style={[styles.modalOption, { color: 'white', fontSize: 20, fontWeight: 'bold' }]}>Si, Eliminar</Text>
            </Button>
            <Button style={styles.button} buttonColor='#6a9eda' onPress={() => { closeModal(null) }}>
              <Text style={[styles.modalOption, { color: 'white' }]}>Cancelar</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const UserDeleteScreen = (props: UserDeleteViewProps) => (
  <DeleteUserProvider>
    <DeleteUser {...props} />
  </DeleteUserProvider>
)

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    padding: 10
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    elevation: 10,
    width: '100%',
  },
  modalOption: {
    fontSize: 18,
    marginBottom: 1,
  },
  button: {
    width: 'auto',
    margin: 2,
    marginLeft: 8,
    marginRight: 8
}
});

export default UserDeleteScreen;