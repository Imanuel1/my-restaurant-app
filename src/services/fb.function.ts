// import functions from "firebase-functions";
// import admin from "firebase-admin";
// admin.initializeApp();

// export const sendNotification = functions.https.onCall(
//   async (data: any, context: any) => {
//     const { title, body, topic } = data;

//     const message = {
//       notification: {
//         title: title,
//         body: body,
//       },
//       topic: topic,
//     };

//     try {
//       await admin.messaging().send(message);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: (error as any)?.message };
//     }
//   }
// );

// // The topic name can be optionally prefixed with "/topics/".
// const topic = 'highScores';

// const message = {
//   data: {
//     score: '850',
//     time: '2:45'
//   },
//   topic: topic
// };

// // Send a message to devices subscribed to the provided topic.
// getMessaging().send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });

export {};
