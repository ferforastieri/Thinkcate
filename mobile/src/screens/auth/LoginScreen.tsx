import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Logo from '../../components/ui/Logo';
import RegisterScreen from './RegisterScreen';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showRegister, setShowRegister] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      showSuccess('Login realizado com sucesso!', 'Bem-vindo ao seu bloco de notas');
    } catch (error) {
      showError('Erro no login', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  const handleRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  if (showRegister) {
    return <RegisterScreen onBackToLogin={handleBackToLogin} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
        <View style={styles.header}>
          <Logo />
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Entrar</Text>
          
          <Input
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0', // Cor de papel envelhecido
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: width * 0.05, // 5% da largura da tela
    paddingVertical: height * 0.03, // 3% da altura da tela
    paddingBottom: height * 0.05, // 5% da altura da tela no bottom
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.04, // 4% da altura da tela
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: width * 0.07, // 7% da largura da tela
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: height * 0.02, // 2% da altura da tela
  },
  formTitle: {
    fontSize: width * 0.07, // 7% da largura da tela
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: height * 0.03, // 3% da altura da tela
    borderBottomWidth: 2,
    borderBottomColor: '#3498DB',
    paddingBottom: 8,
  },
  loginButton: {
    marginTop: 12,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: height * 0.02, // 2% da altura da tela
  },
  forgotPasswordText: {
    fontSize: width * 0.04, // 4% da largura da tela
    color: '#3498DB',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02, // 2% da altura da tela
    backgroundColor: '#FFFFFF',
    padding: width * 0.04, // 4% da largura da tela
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  footerText: {
    fontSize: width * 0.04, // 4% da largura da tela
    color: '#6C757D',
    marginRight: 6,
  },
  registerText: {
    fontSize: width * 0.04, // 4% da largura da tela
    color: '#3498DB',
    fontWeight: 'bold',
  },
});
