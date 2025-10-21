export interface Account {
  id: string
  label: string
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export interface AccountStore {
  accounts: Account[]
}
