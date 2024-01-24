// ErrorModal.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ErrorModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isVisible, closeModal }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <Text style={styles.info}>Error</Text>
        <Button onPress={closeModal} style={styles.button} color='#f45572'>
          <Icon name="check" size={20} color="white" />
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    width: 'auto',
    marginLeft: 8,
    marginRight: 8  

  },
  info: {
    marginBottom: 2,
    textAlign: "center",
    color: 'black',
    fontSize: 28,
    padding: 20,
  },
  // Estilos para el modal (puedes copiar los estilos de AddUserModal o ajustar según sea necesario)
});

export default ErrorModal;
