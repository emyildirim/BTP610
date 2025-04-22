import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";

import { auth, db } from "./firebaseConfig";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  // form fields
  const [emailFromUI, setEmailFromUI] = useState("marry@gmail.com");
  const [passwordFromUI, setPasswordFromUI] = useState("marry123");
  const [errorMessageLabel, setErrorMessageLabel] = useState("");

  const loginPressed = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI);
      //check if the user is owner or renter
      const profile = await getProfileData();
      if (profile.isRenter === true) {
        navigation.navigate("Renter");
      }else {
        navigation.navigate("Owner");
      }
      
    } catch (err) {
      console.log("Error when doing login");
      console.log(`Error code: ${err.code}`);
      console.log(`Error message: ${err.message}`);
      setErrorMessageLabel(err.message);
    }
  };

  const getProfileData = async () => {
    
    // 1. retrieve the user profile data from the firestore collection
    const docSnap = await getDoc(doc(db, "userdata", auth.currentUser.uid));
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Car Rentals!</Text>
      <Text style={styles.text}>Login</Text>
      {/* email tb */}
      <TextInput
        placeholder="Enter email"
        onChangeText={setEmailFromUI}
        value={emailFromUI}
        style={styles.tb}
      />

      {/* password tb */}
      <TextInput
        placeholder="Enter password"
        onChangeText={setPasswordFromUI}
        value={passwordFromUI}
        style={styles.tb}
      />

      <Pressable onPress={loginPressed} style={styles.btn}>
        <Text style={styles.btnLabel}>Login</Text>
      </Pressable>

      <Text>{errorMessageLabel}</Text>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  tb: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#efefef",
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#141D21",
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 8,
  },
  darkBtn: {
    borderWidth: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 8,
  },
  btnLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    color: "blue",
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
});
