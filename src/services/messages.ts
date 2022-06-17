import { database } from "../firebaseConfig";
import { doc, collection, query, getDoc, addDoc, where, getDocs } from "firebase/firestore"; 
import { channel } from "diagnostics_channel";

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
    const QueryConstraint = where("channel",'==', channelDocRef);

    const messageQuery = await query(collection(database, 'messages'), QueryConstraint);
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