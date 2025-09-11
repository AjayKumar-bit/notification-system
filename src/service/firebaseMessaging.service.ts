import messaging from '@react-native-firebase/messaging';

export const  getDeviceToken= async()=> {
	try {
		const token = await messaging().getToken();
		console.log('FCM Device Token:', token);
		return token;
	} catch (error) {
		console.log("got error ",error)
	}
 
}

export const listenNotification=(callback:any)=>{
	messaging().onMessage(async remoteMessage => {
		console.log('FCM Message Data:', remoteMessage.data);
		callback(remoteMessage)
	});
}

export const listenBackgoundNotification=(callback:any)=>{
	messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('Message handled in the background!', remoteMessage);
		callback(remoteMessage)
	});
	
}
