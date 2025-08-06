import {
  doc,
  where,
  query,
  getDocs,
  collection,
  QueryConstraint,
} from "firebase/firestore";
import { database } from "../firebaseConfig";

export const findMessages = async (criteria: string[]) => {
  const searchConstraints: QueryConstraint[] = [];

  criteria.map((crit) => {
    const queryConstraint = where(`terms.${crit}`, "==", true);
    searchConstraints.push(queryConstraint);
  });
  const messagesQuery = await query(
    collection(database, "indexation"),
    ...searchConstraints
  );

  const snapShot = await getDocs(messagesQuery);
  if (snapShot.empty) return [];

  snapShot.forEach(async (snapShot) => {
    const data = snapShot.data();
    console.log(">>>");
    console.log(data);
  });
};
