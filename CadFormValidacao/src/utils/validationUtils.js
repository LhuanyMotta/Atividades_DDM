export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;

  let sum = 0;
  let remainder;

  // Verifica primeiro dígito
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (cpf.charAt(9) !== remainder.toString()) return false;

  // Verifica segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (cpf.charAt(10) !== remainder.toString()) return false;

  return true;
};

export const validateCEP = (cep) => {
  cep = cep.replace(/\D/g, '');
  return cep.length === 8;
};

export const validatePhone = (phone) => {
  phone = phone.replace(/\D/g, '');
  return phone.length >= 10 && phone.length <= 11;
};

export const validateName = (name) => {
  return name.trim().split(/\s+/).length >= 2;
};

export const validatePassword = (password) => {
  // Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
};

export const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date.split('/').reverse().join('-'));
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};