import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


interface ConfirmationModalProps {
  isVisible: boolean;
  onAccept: any;
  onCancel: any;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isVisible, onAccept, onCancel }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <Text style={styles.info}>Seguro que deseas eliminarlo</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onAccept}>
          <Button style={styles.button} buttonColor='#f45572'>
                <Icon name="check" size={20} color="white" /> 
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}> 
            <Button style={styles.button} buttonColor='#6a9eda'>
                <Icon name="close" size={20} color="white" /> 
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    
},
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
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
        fontSize: 16,
}

});

export default ConfirmationModal;
