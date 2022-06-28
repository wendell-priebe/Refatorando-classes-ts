import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IfoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

function Dashboard() {
  const [foods, setFoods] = useState<IfoodPlate[]>([]);
  const [editingFood, setEditingfood] = useState<IfoodPlate>({} as IfoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      await api.get('foods').then((response) => setFoods(response.data));
    }
    loadFoods();
  },[])

  async function handleAddFood(
    food: Omit<IfoodPlate, 'id' | 'available'>
  ): Promise<void> {
    try {
      const { image, name, description, price } = food;

      const response = await api.post('/foods', {
        image,
        name,
        description,
        price,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IfoodPlate , 'id' | 'available'>
  ): Promise<void> {
    const { id } = editingFood;

    const updatedFood = { id, ...food, available:true };

    const response = await api.put(`/foods/${editingFood.id}`, updatedFood);

    const updatedState = foods.filter((item) => item.id !== id);

    setFoods([...updatedState, response.data]);
  }

  async function handleDeleteFood ( id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const updateState = foods.filter(food => food.id !== id);

    setFoods(updateState);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IfoodPlate): void {
    setEditingfood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
  
};

export default Dashboard;