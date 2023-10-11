import { database } from "../firebaseConfig";
import {
  doc,
  collection,
  query,
  getDoc,
  addDoc,
  where,
  getDocs,
  orderBy,
  updateDoc,
  setDoc,
} from "firebase/firestore";

export const createUser = async (params: Record<string, any>) => {
  const docRef = await addDoc(collection(database, "users"), { ...params });
  const resultSnapchot = await getDoc(docRef);

  if (resultSnapchot.exists()) {
    const ref = resultSnapchot.ref.id;
    const user = resultSnapchot.data() as User;
    user.ref = ref;
    return user;
  }
  return null;
};

export const getUserByUID = async (userUID: string): Promise<User | null> => {
  const queryConstraint = where("uid", "==", userUID);
  const userQuery = await query(collection(database, "users"), queryConstraint);
  const userSnaps = await getDocs(userQuery);

  let user: Record<string, any> | null = null;
  if (!userSnaps.size) return null;
  userSnaps.forEach(async (doc) => {
    user = doc.data();
    user.ref = doc.ref.id;
  });
  return user;
};
