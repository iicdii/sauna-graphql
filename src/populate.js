// import { Firestore, db } from './database';
const { Firestore, db } = require('./database');

(async () => {
  for (let i = 0; i < 20; i++) {
    const time = Firestore.FieldValue.serverTimestamp();
    const newPostRef = db.collection('posts').doc();
    await newPostRef.set({
      id: newPostRef.id,
      userId: 'BFgs0Di5dB2qJkSLaL4k',
      title: `${i} best ways to make a gorgeous vase with used PET`,
      content: [
        {
          photo: 'https://i0.wp.com/www.upcyclethat.com/wp-content/uploads/2018/06/pirate_printer_amsterdam.jpg?w=1000&ssl=1',
          description: 'raubdruckerin means female pirate printer. It’s like reverse street art. Rather than putting something into the space, they capture the essence of the city from often overlooked details on the pavement. The pieces are all printed on-site using eco-friendly inks. The manhole covers become the printing templates, with no other print screens or presses used.',
        },
        {
          photo: 'https://i0.wp.com/www.upcyclethat.com/wp-content/uploads/2018/06/pirate_printer_amsterdam.jpg?w=1000&ssl=1',
          description: 'raubdruckerin means female pirate printer. It’s like reverse street art. Rather than putting something into the space, they capture the essence of the city from often overlooked details on the pavement. The pieces are all printed on-site using eco-friendly inks. The manhole covers become the printing templates, with no other print screens or presses used.',
        },
        {
          photo: 'https://i0.wp.com/www.upcyclethat.com/wp-content/uploads/2018/06/pirate_printer_amsterdam.jpg?w=1000&ssl=1',
          description: 'raubdruckerin means female pirate printer. It’s like reverse street art. Rather than putting something into the space, they capture the essence of the city from often overlooked details on the pavement. The pieces are all printed on-site using eco-friendly inks. The manhole covers become the printing templates, with no other print screens or presses used.',
        },
      ],
      likes: [],
      createdAt: time,
      updatedAt: time,
    });
    console.log('success!');
  }
})();