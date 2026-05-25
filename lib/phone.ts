export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhone(phone: string): string {
  const digits = cleanPhone(phone).slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validatePhone(phone: string): boolean {
  const digits = cleanPhone(phone);
  return digits.length === 0 || digits.length === 10 || digits.length === 11;
}
