export const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
  };
  
  export const formatTelefoneFixo = (telefone) => {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
    return telefone;
  };
  
  export const formatCelular = (celular) => {
    celular = celular.replace(/\D/g, '');
    celular = celular.replace(/^(\d{2})(\d)/, '($1) $2');
    celular = celular.replace(/(\d{5})(\d)/, '$1-$2');
    return celular;
  };
  
  export const formatDataNascimento = (data) => {
    data = data.replace(/\D/g, '');
    data = data.replace(/^(\d{2})(\d)/, '$1/$2');
    data = data.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    return data;
  };
  
  export const formatCEP = (cep) => {
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    return cep;
  };