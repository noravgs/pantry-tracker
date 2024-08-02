import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Add item
export const addItem = async (item) => {
  try {
    await addDoc(collection(db, "pantryItems"), item);
  } catch (error) {
    console.error("Error adding item: ", error);
  }
};

// Get all items
export const getItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pantryItems"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error getting items: ", error);
  }
};

// Delete item
export const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, "pantryItems", id));
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};

// Update item
export const updateItem = async (id, updatedData) => {
  try {
    const itemRef = doc(db, "pantryItems", id);
    await updateDoc(itemRef,updatedData);
    console.log("Item updated successfully!");
  } catch (error) {
    console.error("Error updating item: ", error);
  }
};
