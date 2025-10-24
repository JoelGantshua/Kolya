import type { MenuItem } from '../../src/types/menu';

export const menuData: MenuItem[] = [
  // Petit-déjeuner
  {
    id: 'bf1',
    name: 'Petit déjeuner français',
    description: 'Croissants, pains au chocolat, confiture maison, beurre, jus d\'orange pressé et café ou thé',
    price: 12.50,
    category: 'breakfast',
    image: '/images/breakfast/french-breakfast.jpg',
    isPopular: true,
    calories: 450,
    ingredients: ['Croissant', 'Pain au chocolat', 'Confiture maison', 'Beurre', 'Jus d\'orange', 'Café ou thé']
  },
  {
    id: 'bf2',
    name: 'Pancakes aux myrtilles',
    description: 'Pancakes moelleux aux myrtilles fraîches, sirop d\'érable et fruits de saison',
    price: 9.90,
    category: 'breakfast',
    image: '/images/breakfast/blueberry-pancakes.jpg',
    isVegetarian: true,
    calories: 380,
    ingredients: ['Pancakes', 'Myrtilles fraîches', 'Sirop d\'érable', 'Fruits de saison', 'Sucre glace']
  },
  {
    id: 'bf3',
    name: 'Avocado toast',
    description: 'Pain de campagne grillé, avocat écrasé, œufs pochés et graines',
    price: 10.50,
    category: 'breakfast',
    image: '/images/breakfast/avocado-toast.jpg',
    isVegetarian: true,
    isVegan: true,
    calories: 320,
    ingredients: ['Pain de campagne', 'Avocat', 'Œufs pochés', 'Graines de courge', 'Huile d\'olive']
  },

  // Déjeuner
  {
    id: 'ln1',
    name: 'Salade César',
    description: 'Laitue romaine, croûtons, parmesan et sauce césar maison',
    price: 14.90,
    category: 'lunch',
    image: '/images/lunch/caesar-salad.jpg',
    isPopular: true,
    calories: 420,
    ingredients: ['Laitue romaine', 'Croûtons', 'Parmesan', 'Poulet grillé', 'Sauce césar']
  },
  {
    id: 'ln2',
    name: 'Burger gourmet',
    description: 'Pain brioché, steak haché 180g, cheddar, oignons caramélisés, salade et sauce maison',
    price: 16.50,
    category: 'lunch',
    image: '/images/lunch/gourmet-burger.jpg',
    isPopular: true,
    calories: 780,
    ingredients: ['Pain brioché', 'Steak haché', 'Cheddar', 'Oignons caramélisés', 'Cornichons', 'Sauce maison']
  },
  {
    id: 'ln3',
    name: 'Poke bowl saumon',
    description: 'Riz vinaigré, saumon frais, avocat, mangue, concombre et sésame',
    price: 17.90,
    category: 'lunch',
    image: '/images/lunch/salmon-poke.jpg',
    isPopular: true,
    calories: 520,
    ingredients: ['Riz vinaigré', 'Saumon frais', 'Avocat', 'Mangue', 'Concombre', 'Sésame', 'Sauce soja']
  },

  // Dîner
  {
    id: 'dn1',
    name: 'Filet de bœuf',
    description: 'Filet de bœuf 200g, sauce au poivre, gratin dauphinois et légumes de saison',
    price: 28.90,
    category: 'dinner',
    image: '/images/dinner/beef-fillet.jpg',
    isPopular: true,
    calories: 650,
    ingredients: ['Filet de bœuf', 'Poivre', 'Crème fraîche', 'Pommes de terre', 'Légumes de saison']
  },
  {
    id: 'dn2',
    name: 'Risotto aux cèpes',
    description: 'Risotto crémeux aux cèpes frais et parmesan',
    price: 22.50,
    category: 'dinner',
    image: '/images/dinner/mushroom-risotto.jpg',
    isVegetarian: true,
    calories: 480,
    ingredients: ['Riz arborio', 'Cèpes frais', 'Bouillon de légumes', 'Parmesan', 'Vin blanc']
  },
  {
    id: 'dn3',
    name: 'Dos de cabillaud',
    description: 'Dos de cabillaud rôti, purée de petits pois et émulsion au beurre blanc',
    price: 26.90,
    category: 'dinner',
    image: '/images/dinner/cod-fish.jpg',
    calories: 520,
    ingredients: ['Cabillaud', 'Petits pois', 'Beurre', 'Échalotes', 'Vin blanc']
  },

  // Desserts
  {
    id: 'ds1',
    name: 'Fondant au chocolat',
    description: 'Fondant au cœur coulant, glace vanille et fruits rouges',
    price: 8.90,
    category: 'desserts',
    image: '/images/desserts/chocolate-fondant.jpg',
    isPopular: true,
    isVegetarian: true,
    calories: 420,
    ingredients: ['Chocolat noir', 'Beurre', 'Œufs', 'Sucre', 'Glace vanille', 'Fruits rouges']
  },
  {
    id: 'ds2',
    name: 'Tarte Tatin',
    description: 'Tarte renversée aux pommes caramélisées, crème fraîche',
    price: 7.90,
    category: 'desserts',
    image: '/images/desserts/tarte-tatin.jpg',
    isVegetarian: true,
    calories: 380,
    ingredients: ['Pommes', 'Sucre', 'Beurre', 'Pâte feuilletée', 'Crème fraîche']
  },

  // Boissons
  {
    id: 'dr1',
    name: 'Jus pressé',
    description: 'Jus d\'orange, pamplemousse ou ananas pressé',
    price: 4.50,
    category: 'drinks',
    image: '/images/drinks/fresh-juice.jpg',
    isVegetarian: true,
    isVegan: true,
    calories: 120,
    ingredients: ['Fruits frais pressés']
  },
  {
    id: 'dr2',
    name: 'Cocktail maison',
    description: 'Sélection de cocktails préparés par notre barman',
    price: 9.90,
    category: 'drinks',
    image: '/images/drinks/cocktail.jpg',
    isPopular: true,
    calories: 250,
    ingredients: ['Alcool', 'Jus de fruits frais', 'Feuilles de menthe', 'Glaçons']
  }
];
