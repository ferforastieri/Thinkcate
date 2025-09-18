import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  onBackToLogin: () => void;
}

export default function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const { register, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(name, email, password);
      showSuccess('Conta criada com sucesso!', 'Agora você pode fazer login');
    } catch (error) {
      showError('Erro ao criar conta', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  const handleBackToLogin = () => {
    onBackToLogin();
  };

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
          <View style={styles.logoContainer}>
            <Ionicons name="person-add" size={width * 0.12} color="#ECF0F1" />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao seu bloco de notas pessoal</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Registrar</Text>
          
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={errors.name}
          />

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

          <Input
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Button
            title="Criar Conta"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={styles.loginText}>Fazer login</Text>
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
    marginBottom: height * 0.02, // 2% da altura da tela
  },
  logoContainer: {
    width: width * 0.18, // 18% da largura da tela (menor)
    height: width * 0.18, // Mantém proporção quadrada
    borderRadius: width * 0.09, // Metade da largura para círculo perfeito
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.015, // 1.5% da altura da tela
    borderWidth: 3,
    borderColor: '#2ECC71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: width * 0.07, // 7% da largura da tela (menor)
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04, // 4% da largura da tela (menor)
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: width * 0.05, // 5% de padding horizontal
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: width * 0.05, // 5% da largura da tela (menor)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: height * 0.015, // 1.5% da altura da tela
  },
  formTitle: {
    fontSize: width * 0.06, // 6% da largura da tela (menor)
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: height * 0.02, // 2% da altura da tela (menor)
    borderBottomWidth: 2,
    borderBottomColor: '#27AE60',
    paddingBottom: 6,
  },
  registerButton: {
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.015, // 1.5% da altura da tela
    backgroundColor: '#FFFFFF',
    padding: width * 0.03, // 3% da largura da tela (menor)
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  footerText: {
    fontSize: width * 0.04, // 4% da largura da tela
    color: '#6C757D',
    marginRight: 6,
  },
  loginText: {
    fontSize: width * 0.04, // 4% da largura da tela
    color: '#3498DB',
    fontWeight: 'bold',
  },
});
