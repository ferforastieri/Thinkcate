import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Toast customizado com tema de caderno
const CustomToast = (props: any) => {
  return (
    <BaseToast
      {...props}
      style={styles.toastContainer}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Ionicons 
            name={props.type === 'error' ? 'alert-circle' : props.type === 'info' ? 'information-circle' : 'checkmark-circle'} 
            size={24} 
            color={props.type === 'error' ? '#E74C3C' : props.type === 'info' ? '#3498DB' : '#27AE60'} 
          />
        </View>
      )}
      renderTrailingIcon={() => (
        <View style={styles.trailingIcon}>
          <Ionicons name="close" size={16} color="#6C757D" />
        </View>
      )}
    />
  );
};

// Toast de sucesso
const SuccessToast = (props: any) => {
  return (
    <CustomToast
      {...props}
      style={[styles.toastContainer, styles.successToast]}
      text1Style={[styles.text1, styles.successText]}
    />
  );
};

// Toast de erro
const ErrorToastCustom = (props: any) => {
  return (
    <CustomToast
      {...props}
      style={[styles.toastContainer, styles.errorToast]}
      text1Style={[styles.text1, styles.errorText]}
    />
  );
};

// Toast de informação
const InfoToastCustom = (props: any) => {
  return (
    <CustomToast
      {...props}
      style={[styles.toastContainer, styles.infoToast]}
      text1Style={[styles.text1, styles.infoText]}
    />
  );
};

// Configuração do Toast
const toastConfig = {
  success: SuccessToast,
  error: ErrorToastCustom,
  info: InfoToastCustom,
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: width * 0.05,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  successToast: {
    borderLeftColor: '#27AE60',
  },
  errorToast: {
    borderLeftColor: '#E74C3C',
  },
  infoToast: {
    borderLeftColor: '#3498DB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  text2: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 18,
  },
  successText: {
    color: '#27AE60',
  },
  errorText: {
    color: '#E74C3C',
  },
  infoText: {
    color: '#3498DB',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailingIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { toastConfig };
export default Toast;
