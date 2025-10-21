export interface LabelItem {
  text: string
}

export const parseLabels = (labelString: string): LabelItem[] => {
  if (!labelString.trim()) return []

  return labelString
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((text) => ({ text }))
}

export const formatLabels = (labels: LabelItem[]): string => {
  return labels.map((item) => item.text).join('; ')
}
