export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts';
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
  ingredients: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type MenuCategory = {
  id: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts';
  name: string;
  description: string;
  image?: string;
};
