import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import Input from './Input';
import { validateEmail, validateCPF, validateCEP, validatePhone, validateName, validatePassword, calculateAge } from '../utils/validationUtils';
import { formatCPF, formatTelefoneFixo, formatCelular, formatDataNascimento, formatCEP } from '../utils/formattingUtils';
import styles from '../styles';

const CadastroForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    telefoneFixo: '',
    celular: '',
    nomePai: '',
    nomeMae: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState({});
  const [isMinor, setIsMinor] = useState(false);
  const [age, setAge] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (name, value) => {
    let formattedValue = value;

    switch (name) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'telefoneFixo':
        formattedValue = formatTelefoneFixo(value);
        break;
      case 'celular':
        formattedValue = formatCelular(value);
        break;
      case 'dataNascimento':
        formattedValue = formatDataNascimento(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      default:
        break;
    }

    setFormData({ ...formData, [name]: formattedValue });
    validateField(name, formattedValue);

    if (name === 'dataNascimento' && formattedValue.length === 10) {
      const calculatedAge = calculateAge(formattedValue);
      setAge(calculatedAge);
      setIsMinor(calculatedAge < 18);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nome':
        if (!validateName(value)) {
          error = 'Nome completo inválido (mínimo 2 nomes).';
        }
        break;
      case 'dataNascimento':
        if (!value) {
          error = 'Data de nascimento é obrigatória.';
        } else if (calculateAge(value) < 18) {
          setIsMinor(true);
        } else {
          setIsMinor(false);
        }
        break;
      case 'cpf':
        if (!validateCPF(value)) {
          error = 'CPF inválido.';
        }
        break;
      case 'telefoneFixo':
      case 'celular':
        if (!validatePhone(value, name === 'celular')) {
          error = name === 'telefoneFixo' ? 'Telefone fixo inválido.' : 'Celular inválido.';
        }
        break;
      case 'cep':
        if (!validateCEP(value)) {
          error = 'CEP inválido.';
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          error = 'Email inválido.';
        }
        break;
      case 'senha':
        if (!value) {
          error = 'Senha é obrigatória.';
        } else if (!validatePassword(value)) {
          error = 'Senha fraca. Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e especiais.';
        }
        break;
      case 'confirmarSenha':
        if (!value) {
          error = 'Confirmação de senha é obrigatória.';
        } else if (value !== formData.senha) {
          error = 'As senhas não coincidem.';
        }
        break;
      case 'nomePai':
      case 'nomeMae':
        if (isMinor && !value) {
          error = 'Este campo é obrigatório para menores de 18 anos.';
        }
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!validateName(formData.nome)) newErrors.nome = 'Nome completo inválido (mínimo 2 nomes).';
        if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
        if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido.';
        if (!validatePhone(formData.telefoneFixo, false)) newErrors.telefoneFixo = 'Telefone fixo inválido.';
        if (!validatePhone(formData.celular, true)) newErrors.celular = 'Celular inválido.';
        break;
      case 2:
        if (isMinor && !formData.nomePai) newErrors.nomePai = 'Nome do Pai é obrigatório para menores de 18 anos.';
        if (isMinor && !formData.nomeMae) newErrors.nomeMae = 'Nome da Mãe é obrigatório para menores de 18 anos.';
        if (!validateCEP(formData.cep)) newErrors.cep = 'CEP inválido.';
        if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório.';
        if (!formData.numero) newErrors.numero = 'Número é obrigatório.';
        if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória.';
        if (!formData.estado) newErrors.estado = 'Estado é obrigatório.';
        break;
      case 3:
        if (!validateEmail(formData.email)) newErrors.email = 'Email inválido.';
        if (!formData.senha) newErrors.senha = 'Senha é obrigatória.';
        else if (!validatePassword(formData.senha)) newErrors.senha = 'Senha fraca. Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e especiais.';
        if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória.';
        else if (formData.confirmarSenha !== formData.senha) newErrors.confirmarSenha = 'As senhas não coincidem.';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  const handleNextStep = () => {
    const isStepValid = validateStep(currentStep);
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário antes de avançar.');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const isStepValid = validateStep(currentStep);
    if (isStepValid) {
      Alert.alert(
        'Confirmação',
        'Você tem certeza que deseja enviar o formulário?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Enviar',
            onPress: () => {
              console.log('Dados enviados:', formData);
              Alert.alert('Sucesso', 'Formulário enviado com sucesso!');
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário antes de enviar.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <Input label="Nome Completo" value={formData.nome} onChangeText={(text) => handleChange('nome', text)} error={errors.nome} />
            <Input label="Data de Nascimento (DD/MM/AAAA)" value={formData.dataNascimento} onChangeText={(text) => handleChange('dataNascimento', text)} error={errors.dataNascimento} keyboardType="numeric" maxLength={10} />
            {age !== null && <Text style={isMinor ? styles.error : styles.hint}>Idade: {age} anos {isMinor && '(Menor de 18 anos)'}</Text>}
            <Input label="CPF" value={formData.cpf} onChangeText={(text) => handleChange('cpf', text)} error={errors.cpf} keyboardType="numeric" maxLength={14} />
            <Input label="Telefone Fixo (DDD)" value={formData.telefoneFixo} onChangeText={(text) => handleChange('telefoneFixo', text)} error={errors.telefoneFixo} keyboardType="numeric" maxLength={14} />
            <Input label="Celular (DDD)" value={formData.celular} onChangeText={(text) => handleChange('celular', text)} error={errors.celular} keyboardType="numeric" maxLength={15} />
            <TouchableOpacity onPress={handleNextStep} style={styles.button}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Complementares</Text>
            {isMinor && (
              <>
                <Input label="Nome do Pai" value={formData.nomePai} onChangeText={(text) => handleChange('nomePai', text)} error={errors.nomePai} />
                <Input label="Nome da Mãe" value={formData.nomeMae} onChangeText={(text) => handleChange('nomeMae', text)} error={errors.nomeMae} />
              </>
            )}
            <Input label="CEP" value={formData.cep} onChangeText={(text) => handleChange('cep', text)} error={errors.cep} keyboardType="numeric" maxLength={9} />
            <Input label="Endereço" value={formData.endereco} onChangeText={(text) => handleChange('endereco', text)} error={errors.endereco} />
            <Input label="Número" value={formData.numero} onChangeText={(text) => handleChange('numero', text)} error={errors.numero} keyboardType="numeric" />
            <Input label="Complemento (opcional)" value={formData.complemento} onChangeText={(text) => handleChange('complemento', text)} error={errors.complemento} />
            <Input label="Cidade" value={formData.cidade} onChangeText={(text) => handleChange('cidade', text)} error={errors.cidade} />
            <Input label="Estado" value={formData.estado} onChangeText={(text) => handleChange('estado', text)} error={errors.estado} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handlePreviousStep} style={styles.button}>
                <Text style={styles.buttonText}>Anterior</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextStep} style={styles.button}>
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Conta</Text>
            <Input label="Email" value={formData.email} onChangeText={(text) => handleChange('email', text)} error={errors.email} keyboardType="email-address" />
            <Input label="Senha" value={formData.senha} onChangeText={(text) => handleChange('senha', text)} error={errors.senha} secureTextEntry />
            <Input label="Confirmar Senha" value={formData.confirmarSenha} onChangeText={(text) => handleChange('confirmarSenha', text)} error={errors.confirmarSenha} secureTextEntry />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handlePreviousStep} style={styles.button}>
                <Text style={styles.buttonText}>Anterior</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CadastroForm;