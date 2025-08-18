import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

export const ProfileModal = React.memo(
  ({ visible, onClose, title, content }) => {
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

            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.date}>Last updated: August 1, 2025</Text>

              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.text}>
                We may collect personal information such as your name and email,
                transaction data (like expenses, categories), and usage data for
                analytics.
              </Text>

              <Text style={styles.sectionTitle}>
                2. How We Use Your Information
              </Text>
              <Text style={styles.text}>
                Your data is used to provide core functionalities, improve user
                experience, and ensure app security. We do not sell your data.
              </Text>

              <Text style={styles.sectionTitle}>
                3. Data Storage and Security
              </Text>
              <Text style={styles.text}>
                Your data is securely stored either on your device or encrypted
                cloud services if enabled. We use industry-standard security
                practices.
              </Text>

              <Text style={styles.sectionTitle}>4. Data Sharing</Text>
              <Text style={styles.text}>
                We never sell your data. We may share information only with your
                consent or if required by law.
              </Text>

              <Text style={styles.sectionTitle}>5. User Control</Text>
              <Text style={styles.text}>
                You can edit or delete your data anytime in-app. For full data
                deletion, contact our support.
              </Text>

              <Text style={styles.sectionTitle}>6. Children’s Privacy</Text>
              <Text style={styles.text}>
                This app is not intended for children under 13. We do not
                knowingly collect data from them.
              </Text>

              <Text style={styles.sectionTitle}>7. Policy Changes</Text>
              <Text style={styles.text}>
                This policy may change occasionally. Updated policies will be
                posted in the app.
              </Text>

              <Text style={styles.sectionTitle}>8. Contact Us</Text>
              <Text style={styles.text}>
                Email us at:{' '}
                <Text style={{ color: '#00b4d8' }}>
                  {' '}
                  support@expensetrackerapp.com
                </Text>{' '}
                for any questions.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  },
);

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
  modalText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    color: '#fff',
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 16,
    marginBottom: 4,
    color: '#fff',
  },
  text: {
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
  },
});
