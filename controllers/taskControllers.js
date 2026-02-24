import { databases } from '../config/appwrite.js';
import { ID, Query } from 'appwrite';

// GET
export const getTasks = async (req, res) => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt') // 2. Tambahkan baris ini untuk urutkan dari yang terbaru
      ]
    );

    res.json(response.documents);
  } catch (error) {
    console.error("ERROR GET TASKS:", error); // 🔥 ini penting
    res.status(500).json({ error: error.message });
  }
};

// CREATE
export const createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    const task = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      ID.unique(),
      { title, description, due_date, priority, status: 'Pending' }
    );
    console.log("BERHASIL MASUK DB:", task);
    res.json(task);
  } catch (err) {
    console.error("ERROR CREATE TASK:", err); // 🔥 WAJIB
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority, status } = req.body;

    const updated = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      id,
      { title, description, due_date, priority, status } // Pastikan mapping manual
    );

    res.json(updated);
  } catch (error) {
    console.error("DETAIL ERROR APPWRITE:", error.response); // Cek detail error di sini
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      id
    );

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};