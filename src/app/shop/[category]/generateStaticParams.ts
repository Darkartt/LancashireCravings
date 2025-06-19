// This file must be server-side code
export function generateStaticParams() {
  return [
    { category: 'tables' },
    { category: 'chairs' },
    { category: 'cabinets' },
    { category: 'accessories' },
    { category: 'all' },
    { category: 'decorative' },
    { category: 'kitchenware' },
    { category: 'furniture' },
    { category: 'sculptures' },
    { category: 'gifts' },
    { category: 'memorial' }
  ];
}
