export const validateLogin = (login: string): boolean => {
  return login.trim().length > 0 && login.length <= 100
}

export const validatePassword = (password: string | null, accountType: string): boolean => {
  if (accountType === 'Локальная') {
    return password !== null && password.trim().length > 0 && password.length <= 100
  }
  return true
}

export const validateLabel = (label: string): boolean => {
  return label.length <= 50
}
