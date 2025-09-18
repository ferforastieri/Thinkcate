import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showSuccess = (message: string, description?: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      text2: description,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const showError = (message: string, description?: string) => {
    Toast.show({
      type: 'error',
      text1: message,
      text2: description,
      visibilityTime: 5000,
      autoHide: true,
    });
  };

  const showInfo = (message: string, description?: string) => {
    Toast.show({
      type: 'info',
      text1: message,
      text2: description,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const hide = () => {
    Toast.hide();
  };

  return {
    showSuccess,
    showError,
    showInfo,
    hide,
  };
};
