/*
message {link} message

un message peut être lié à un autre message,
les liens peuvent être qualifiés.

en cliquant sur un message trouver les autres qui lui sont liés
Si c'est un lien qualifié c link c metadata
exemple : marx : michel (philosophy)
> 1/ deux modes d'édition
--> [source]
/link to tag [x x x]
2/ click sur un contenu
    click sur bouton de lien
        popup de lien
            recherche un contenu / tag/ content/ fulltext
*/

import { database } from "../firebaseConfig";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  where,
  query,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

export const createAnnotation = async (annotation: Annotation) => {
  const refMessage = doc(database, "messages", annotation.messageRef);
  const docRef = await addDoc(collection(database, "annotations"), {
    ...annotation,
    messageRef: refMessage,
  });
  const resultSnapchot = await getDoc(docRef);
  return resultSnapchot.data;
};

export const getMessageAnnotations = async (message: Message) => {
  const refMessage = doc(database, "messages", message.ref as string);
  const queryConstraint = where("messageRef", "==", refMessage);
  const annotationsQuery = await query(
    collection(database, "annotations"),
    queryConstraint
  );
  // annotation
  let annotations: Annotation[] = [];
  const snapShot = await getDocs(annotationsQuery);
  if (snapShot.empty) return annotations;

  snapShot.forEach(async (snapShot) => {
    const data = snapShot.data();
    data.messageRef = data.messageRef.id;
    annotations = [...annotations, data as Annotation];
  });

  return annotations;
};
