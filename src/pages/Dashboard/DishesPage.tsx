import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSave, FiX } from 'react-icons/fi';
import api from '../../services/api';
import styles from './DishesPage.module.css';

interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isSpecial: boolean;
  isVegetarian: boolean;
  image?: string;
}

const DishesPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState<Partial<Dish>>({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    isSpecial: false,
    isVegetarian: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Charger la liste des plats
  const fetchDishes = async () => {
    try {
      const { data } = await api.get('/api/v1/dishes');
      setDishes(data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des plats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingDish) {
        // Mise à jour d'un plat existant
        await api.put(`/api/v1/dishes/${editingDish._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Création d'un nouveau plat
        await api.post('/api/v1/dishes', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Réinitialiser le formulaire et recharger la liste
      resetForm();
      fetchDishes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du plat:', error);
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      isSpecial: dish.isSpecial,
      isVegetarian: dish.isVegetarian,
    });
    if (dish.image) {
      setPreviewImage(dish.image);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        await api.delete(`/api/v1/dishes/${id}`);
        fetchDishes();
      } catch (error) {
        console.error('Erreur lors de la suppression du plat:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'main',
      isSpecial: false,
      isVegetarian: false,
    });
    setImageFile(null);
    setPreviewImage(null);
    setEditingDish(null);
  };

  const openNewDishModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Chargement des plats...</div>;
  }

  const categories = [
    { value: 'entree', label: 'Entrée' },
    { value: 'main', label: 'Plat principal' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'boisson', label: 'Boisson' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestion des plats</h2>
        <button 
          className={styles.addButton}
          onClick={openNewDishModal}
        >
          <FiPlus /> Ajouter un plat
        </button>
      </div>

      <div className={styles.dishesGrid}>
        {dishes.map((dish) => (
          <div key={dish._id} className={styles.dishCard}>
            <div className={styles.dishImage}>
              {dish.image ? (
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-dish.jpg';
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <FiImage size={40} />
                </div>
              )}
            </div>
            <div className={styles.dishInfo}>
              <h3>{dish.name}</h3>
              <p className={styles.description}>{dish.description}</p>
              <div className={styles.dishMeta}>
                <span className={styles.price}>{dish.price} €</span>
                <div className={styles.tags}>
                  {dish.isSpecial && <span className={styles.specialTag}>Spécial</span>}
                  {dish.isVegetarian && <span className={styles.vegTag}>Végétarien</span>}
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.editButton}
                onClick={() => handleEdit(dish)}
              >
                <FiEdit2 />
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDelete(dish._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingDish ? 'Modifier le plat' : 'Ajouter un nouveau plat'}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nom du plat</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                  <label>Catégorie</label>
                  <select
                    name="category"
                    value={formData.category || 'main'}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isSpecial"
                    checked={formData.isSpecial || false}
                    onChange={handleInputChange}
                  />
                  <span>Plat du jour/Spécial</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian || false}
                    onChange={handleInputChange}
                  />
                  <span>Végétarien</span>
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label>Image du plat</label>
                <div className={styles.imageUpload}>
                  {previewImage ? (
                    <div className={styles.imagePreview}>
                      <img src={previewImage} alt="Aperçu" />
                      <button 
                        type="button"
                        className={styles.changeImageButton}
                        onClick={() => {
                          setImageFile(null);
                          setPreviewImage(null);
                        }}
                      >
                        Changer l'image
                      </button>
                    </div>
                  ) : (
                    <label className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                      />
                      <FiImage size={32} />
                      <span>Cliquez pour télécharger une image</span>
                    </label>
                  )}
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className={styles.saveButton}>
                  <FiSave /> {editingDish ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishesPage;
