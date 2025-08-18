import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { currencyList } from '../constants/currencyList';
import { moderateScale } from 'react-native-size-matters';

const { height } = Dimensions.get('window');

export const CurrencyModal = React.memo(({ visible, onClose, title }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.fullScreenModal}>
          <View style={styles.headerConatiner}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Ionicons name="chevron-back" size={25} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <FlatList
            data={currencyList}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.currencyItem}>
                <View style={styles.currencyCodeIcon}>
                  {item.iconLibrary === 'FontAwesome5' ? (
                    <FontAwesome5 name={item.icon} size={20} color="#fff" />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={20}
                      color="#fff"
                    />
                  )}
                </View>
                <View style={styles.currencyCodeContainer}>
                  <Text style={styles.currencyCode}>{item.code}</Text>
                  <Text style={styles.currencyName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#374151',
    borderRadius: 10,
    marginRight: 10,
    padding: 5,
    alignItems: 'center',
  },
  fullScreenModal: {
    height: height * 1,
    width: '100%',
    backgroundColor: '#1f2937',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  currencyCodeIcon: {
    backgroundColor: '#374151',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyCode: {
    color: '#fff',
    fontSize: 16,
  },
  currencyName: {
    color: '#ccc',
    fontSize: 12,
  },
  currencyItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: moderateScale(10),
  },
});
