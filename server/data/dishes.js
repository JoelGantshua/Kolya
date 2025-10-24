const dishes = [
  {
    name: 'Salade César',
    description: 'Laitue romaine, croûtons, parmesan et sauce césar',
    price: 9.90,
    category: 'entrées',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    image: 'salade-cesar.jpg'
  },
  {
    name: 'Tartare de Saumon',
    description: 'Tartare de saumon frais, avocat, citron et aneth',
    price: 14.50,
    category: 'entrées',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    image: 'tartare-saumon.jpg'
  },
  {
    name: 'Entrecôte de Bœuf',
    description: 'Entrecôte de bœuf française, sauce au poivre, frites maison',
    price: 24.90,
    category: 'plats',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    image: 'entrecote.jpg'
  },
  {
    name: 'Risotto aux Champignons',
    description: 'Risotto crémeux aux cèpes et parmesan',
    price: 18.50,
    category: 'plats',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'risotto-champignons.jpg'
  },
  {
    name: 'Poulet Tikka Masala',
    description: 'Poulet mariné au yaourt et épices, sauce tomate crémeuse, riz basmati',
    price: 19.90,
    category: 'plats',
    isVegetarian: false,
    isSpicy: true,
    isAvailable: true,
    image: 'poulet-tikka.jpg'
  },
  {
    name: 'Fondant au Chocolat',
    description: 'Fondant chaud au cœur coulant, glace vanille',
    price: 8.50,
    category: 'desserts',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'fondant-chocolat.jpg'
  },
  {
    name: 'Tiramisu',
    description: 'Le classique italien au café et mascarpone',
    price: 7.90,
    category: 'desserts',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'tiramisu.jpg'
  },
  {
    name: 'Eau Minérale',
    description: 'Bouteille 50cl',
    price: 3.50,
    category: 'boissons',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'eau-minerale.jpg'
  },
  {
    name: 'Vin Rouge Maison',
    description: 'Verre de vin rouge de la région',
    price: 5.50,
    category: 'boissons',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'vin-rouge.jpg'
  },
  {
    name: 'Menu Enfant',
    description: 'Steak haché, frites, boisson et glace',
    price: 12.90,
    category: 'menus',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    image: 'menu-enfant.jpg'
  },
  {
    name: 'Plateau de Fromages',
    description: 'Sélection de fromages français, confiture d\'oignons et noix',
    price: 16.90,
    category: 'spécialités',
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true,
    image: 'plateau-fromages.jpg'
  },
  {
    name: 'Carpaccio de Saint-Jacques',
    description: 'Saint-jacques marinées au citron vert et huile d\'olive',
    price: 18.90,
    category: 'spécialités',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    image: 'carpaccio-saint-jacques.jpg'
  }
];

module.exports = dishes;
