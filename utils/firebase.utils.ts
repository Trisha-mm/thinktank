
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";


export const addOrUpdateUser = async (userId: string, email: string, name: string, levelsCompleted: number  = 0) => {
  try {
    // Reference to the user document
    const userDocRef = doc(db, "users", userId);
    
    // Check if user document exists
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      // User exists, update the document
      const existingData = userDocSnap.data();
      
      const updateData = {
        name: name,
        email: email,
        // Only update levelsCompleted if it's provided and greater than existing
        ...(levelsCompleted > (existingData.levelsCompleted || 0) && { 
          levelsCompleted: levelsCompleted 
        })
      };
      
      await updateDoc(userDocRef, updateData);
      console.log("User updated successfully:", userId);
      return { success: true, action: "updated", userId };
      
    } else {
      // User doesn't exist, create new document
      const userData = {
        name: name,
        email: email,
        levelsCompleted: levelsCompleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(userDocRef, userData);
      console.log("New user created successfully:", userId);
      return { success: true, action: "created", userId };
    }
    
  } catch (error: any ) {
    console.error("Error adding/updating user:", error);
    return { success: false, error: error.message };
  }
};


export const updateUserLevels = async (userId: string, levelsCompleted: number) => {
  try {
    const userDocRef = doc(db, "users", userId);
    
    await updateDoc(userDocRef, {
      levelsCompleted: levelsCompleted,
      updatedAt: new Date().toISOString()
    });
    
    console.log("User levels updated successfully:", userId);
    return { success: true, userId, levelsCompleted };
    
  } catch (error: any) {
    console.error("Error updating user levels:", error);
    return { success: false, error: error?.message };
  }
};