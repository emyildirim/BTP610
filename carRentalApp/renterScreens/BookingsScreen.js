import { StyleSheet, Text, View, Button, Pressable, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const ListingScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [carBooked, setCarBooked] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getProfileData();
    navigation.setOptions({
      headerRight: () => <Button onPress={logoutUser} title="Logout" />,});
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // screen is focused
      getCar();
      if (carBooked) {
        (async () => {
          try {
            const docSnap = await getDoc(doc(db, "userdata", carBooked.owner));
            if (docSnap.exists()) {
              setOwnerName(docSnap.data().name);
            }
          } catch (err) {
            console.log(err);
          }
        })();
      }
      // screen is unfocused
      return () => {
      };
    }, [carBooked])
  );
  

  const getProfileData = async () => {
    // 1. retrieve the user profile data from the firestore collection
    const docSnap = await getDoc(doc(db, "userdata", auth.currentUser.uid));
    if (docSnap.exists()) {
      console.log("user: ", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    setProfile(docSnap.data());
  };

  const getCar = async () => {
    try {
      // find the car with renter = logged in user
      const q = query(collection(db, "cars"), where("renter", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      // update the state with the car data
      if (!querySnapshot.empty) {
        setCarBooked(querySnapshot.docs[0].data());
      } else {
        console.log("No car booked by the user.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelBooking = async () => {
    try{
      //get the id of car booked
      const q = query(collection(db, "cars"), where("renter", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
        // update the car document to set the renter and bookingcode to null
      const carRef = doc(db, "cars", querySnapshot.docs[0].id);
      await updateDoc(carRef, {
        renter: null,
        bookingcode: null,
      });
      // update the carList state to remove the item
      setCarBooked(null);
      alert("Booking cancelled successfully!");
    } catch (err) {
      console.log("Error cancelling booking", err);
      setErrorMsg(err.message);
    }
   
  }

  const logoutUser = () => {
    auth.signOut();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
        {profile && (
          <View style={{gap: 5}}>
            <Text>Name: {profile.name}</Text>
            <Text>Account Type: {profile.isRenter ? "Renter" : "Owner"}</Text>
          </View>
        )}
        {auth.currentUser && (<Text>Email: {auth.currentUser.email}</Text>)}
      </View>
      <View style={styles.hr}></View>

      <View
        style={{ height: "100%", width: "100%", gap: 15, alignItems: "center" }}
      >
        {carBooked ? (
          <View style={{ height: "100%", width: "100%", gap: 15, alignItems: "center",}}>
            <Image
              style={{ width: 250, height: 150 }}
              source={{ uri: carBooked.photo }}
            />
            <Text style={styles.bold}>Confirmation #: {carBooked.bookingcode}</Text>
            <View style={{ gap: 20 }}>
              <View>
                <View style={styles.row}>
                  <Text style={styles.bold}>Model</Text>
                  <Text style={styles.bold}>License Plate</Text>
                  <Text style={styles.bold}>Price</Text>
                </View>
                <View style={styles.row}>
                  <Text>{carBooked.model}</Text>
                  <Text>{carBooked.licensePlate}</Text>
                  <Text>${carBooked.price}</Text>
                </View>
              </View>
              <View>
                <View style={styles.row}>
                  <Text style={styles.bold}>Owner</Text>
                  <Text style={styles.bold}>City</Text>
                  <Text style={styles.bold}>Address</Text>
                </View>
                <View style={styles.row}>
                  <Text >{ownerName}</Text>
                  <Text>{carBooked.city}</Text>
                  <Text>{carBooked.address}</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.cancelBtn} onPress={cancelBooking}>
                <Text style={styles.btnLabel}>Cancel Booking</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ height: "100%", justifyContent: "center" }}>
            <Text style={styles.warning}>No Booking found!</Text>
          </View>
        )}
      </View>
      {errorMsg && (<Text style={styles.warning}>{errorMsg}</Text>)}
    </View>
  );
};
export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  bold: {
    fontWeight: "bold",
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
  cancelBtn: {
    marginTop: 20,
    borderWidth: 1,
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 8,
  },
  btnLabel: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  warning: {
    fontSize: 16,
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
    justifyContent: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
    justifyContent: "space-between",
  },
  hr:{
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
});
