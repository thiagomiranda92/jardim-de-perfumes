import { useEffect, useState } from 'react';

export interface OrderItem { label: string; quantity: number }

const storageKey = 'jardim-de-perfumes:lista';

// A lista é só uma conveniência do visitante: sem armazenamento disponível, ela vale até fechar a página.
function loadItems(): OrderItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(item => typeof item?.label === 'string' && Number.isInteger(item?.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export function useOrderList() {
  const [items, setItems] = useState<OrderItem[]>(loadItems);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Sem armazenamento, a lista continua funcionando em memória.
    }
  }, [items]);
  const add = (label: string) => setItems(current => current.some(item => item.label === label)
    ? current.map(item => item.label === label ? { ...item, quantity: item.quantity + 1 } : item)
    : [...current, { label, quantity: 1 }]);
  const setQuantity = (label: string, quantity: number) => setItems(current => quantity > 0
    ? current.map(item => item.label === label ? { ...item, quantity } : item)
    : current.filter(item => item.label !== label));
  const count = items.reduce((total, item) => total + item.quantity, 0);
  return { items, count, add, setQuantity };
}

export const orderMessage = (items: OrderItem[]) => [
  'Olá! Vim pelo site e gostaria de fazer um pedido:',
  '',
  ...items.map(item => `• ${item.quantity}x ${item.label}`),
  '',
  'Poderia me informar a disponibilidade e os valores?',
].join('\n');
