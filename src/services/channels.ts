
import { database } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore"; 


export const createChannel = async (name:string) => {
    
  return await addDoc(collection(database, 'channels'), {
    name,
    isProtected: false,
    createdBy:"users/lVDFeyexxq2zSxZra9AG",
    pass: null
  });
}

export const getChannels = async() => {
    const querySnapShot = await getDocs(collection(database, 'channels'))
    const channels:Record<string, any>[] = []
    querySnapShot.forEach( async doc => {
        let channel = doc.data();
        channel.ref = doc.id;
        channels.push(channel);
    });
    return channels;
}