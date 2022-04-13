const firebaseConfig = {
    apiKey: "AIzaSyDX0PrbtBoeOj6XMP_BlqeJ9EMptX7XQTQ",
    authDomain: "playsk8.firebaseapp.com",
    databaseURL: "https://playsk8-default-rtdb.firebaseio.com",
    projectId: "playsk8",
    storageBucket: "playsk8.appspot.com",
    messagingSenderId: "1033335410277",
    appId: "1:1033335410277:web:955fd507c941e5a7c1c08c"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();