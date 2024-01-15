import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getNextColor } from '../../../../../components/colors';
import ConfirmationModal from '../../../../../components/modal';
import User from '../../../domain/entities/users';
import BackendConfig from '../../../../../config/backend/config';

type CardProps = {
    user : User,
    onEdit?: Function,
    searchTerm: string;
}

const SavingCard: React.FC<CardProps> = ({
    user,
    onEdit,
    searchTerm,
}) => {

    const [isModalVisible, setModalVisible] = useState(false);

    const [deleted, setDeleted, ] = useState(false);

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const [currentColor, setCurrentColor] = useState(getNextColor());

    const isMatch = () => {
        const fullName = `${user.name} ${user.lastname}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      };
    
      // No renderizar el componente si no coincide con la búsqueda
      if (!isMatch()) {
        return null;
      }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setDeleteModalVisible(false);
    };

    const handleEdit = () => {
        console.log('Opening modal...')
        setModalVisible(true);
        if(onEdit){
            onEdit(user);
        }
    };

    const openDeleteModal = () => {
        toggleModal();
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteC(user.id);
            // Cierra el modal después de la eliminación
            toggleModal();
        } catch (error) {
            // Manejar cualquier error que ocurra durante la eliminación
        }
    }

    const deleteC = async (id:any) => {
      
        return fetch (`${BackendConfig.url}/api/users?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
         })
         .then((response) => response.json())
         .then((response) => {
            console.log(response);

        setDeleted(true);
    
        return response;
            
         });
    
    };

    useEffect(() => {
        setCurrentColor(getNextColor()); // Actualiza el color al montar el componente
    }, []); // Asegura que esto se ejecute solo una vez al montar

    // Verificar si la categoría se ha eliminado
    if (deleted) {
    // Puedes mostrar un mensaje o hacer cualquier otra acción aquí
        return null;
    }

    return (

            <View style={styles.container}>
                <View style={styles.space}>
                <TouchableOpacity style={{ ...styles.cardContainer, backgroundColor: currentColor}}>
           
                    <View>
                        <View style={styles.cardInfo}>
                        <Text style={styles.info}>Nombre: {user.name}</Text>
                        <Text style={styles.info}>A. Paterno: {user.lastname}</Text>
                        <Text style={styles.info}>A. Materno: {user.secondLastname}</Text>
                        <Text style={styles.info}>Teléfono: {user.phone}</Text>
                        <Text style={styles.info}>Correo: {user.email}</Text>
                        <Text style={styles.info}>Dirección: {user.address}</Text>
                        <Text style={styles.info}>Estatus: {user.statusName?.name}</Text>
                        <Text style={styles.info}>Curso: {user.areaName?.name}</Text>
                        <Text style={styles.info}>Observaciones: {user.observations}</Text>
                        </View>
            
                    </View> 
                </TouchableOpacity>
                <View style={styles.buttonContainer}>    
                    <Button style={styles.button} buttonColor='#6a9eda' onPress={handleEdit}>
                        <Icon name="edit" size={20} color="white" /> 
                    </Button>

                    <Button style={styles.button} buttonColor='#f45572' onPress={openDeleteModal}>
                        <Icon name="delete" size={20} color="white" />
                    </Button>
                    <ConfirmationModal
                         isVisible={isDeleteModalVisible}  // Utiliza el nuevo estado
                         onAccept={confirmDelete}
                         onCancel={() => setDeleteModalVisible(false)} 
                    />
                </View>
                </View>
            </View>
        
    );
}

export default SavingCard;


const styles = StyleSheet.create({

    container: {  

        flexWrap: 'wrap',
        display:'flex',
        height:'auto',
        width: 'auto',
    },
    space: {

        backgroundColor: '#fff',
        borderRadius: 8,
        // Propiedades específicas de la sombra en Android
        elevation: 5,
        // Propiedades específicas de la sombra en iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginRight: 11,
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 7
    },
    cardContainer: {
        padding: 8,
        borderRadius: 14,
        border: 1,
        minWidth: '95%',
        overflow: "hidden",
        margin: 9,
    },

    cardInfo: {
        padding: 8,
    },

    info: {
        marginBottom: 2,
        textAlign: "center",
        color: 'black',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        width: 'auto',
        marginLeft: 8,
        marginRight: 8

    }
})
