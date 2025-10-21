export interface LabelItem {
  text: string
}

export interface Account {
  id: string
  label: string
  labels: LabelItem[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export interface AccountStore {
  accounts: Account[]
}
