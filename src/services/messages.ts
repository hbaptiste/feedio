import { database } from "../firebaseConfig";
import { doc, collection, query, getDoc, addDoc, where, getDocs, orderBy, limit } from "firebase/firestore"; 

export const createMessage = async (message:Record<string,any>) => {
    
    const refChannel = doc(database, "channels", message.channel);
    message.channel = refChannel;
    const messageDoc = await addDoc(collection(database, 'messages'), message)
    const data = await (await getDoc(messageDoc)).data();
    const channelRef = data?.channel.ref;
    const msgData = Object.assign({}, data, {channel:channelRef} );
    return msgData;
  }

  export const getMessages  = async (channelRef: string) => {
      const channelDocRef  = doc(database, "channels", channelRef);
    const queryConstraint = where("channel",'==', channelDocRef);
    const orderContraint = orderBy("createdAt", "asc")

    const messageQuery = await query(collection(database, 'messages'), queryConstraint, orderContraint);
    const messages:Record<string, any>[] = []
    const messagesSnaps = await getDocs(messageQuery); 
    
    messagesSnaps.forEach( async doc => {
        const data = doc.data();
        const {channel, from} = data;
        let pseudo:string = ""
        //pseudo = await (await getDoc(from)).data().pseudo
        const msgData = Object.assign({}, doc.data(), { channel:channel.path, from:from.path })
        
        messages.push(msgData)
    });

   return messages;
  }