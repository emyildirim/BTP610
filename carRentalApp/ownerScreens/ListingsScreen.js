import { StyleSheet, Text, View, Button, FlatList, Image, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
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
  const [carList, setCarList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Will execute when the screen loads (mounting phase)
  useEffect(() => {
    getProfileData();
    getCars();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={logoutUser} title="Logout" />,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getCars();
      // screen is unfocused
      return () => {
      };
    }, [carList])
  );


  const getProfileData = async () => {
    // 1. retrieve the user profile data from the firestore collection
    const docSnap = await getDoc(doc(db, "userdata", auth.currentUser.uid));
    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    setProfile(docSnap.data());
  };

  const getCars = async () => {
    try {
      // 1. get the user profile so we can check if the user is a producer
      const docSnap = await getDoc(doc(db, "userdata", auth.currentUser.uid));
      const profile = docSnap.data();
      if (profile.isRenter === true) {
        setErrorMessage("You must be a Car Owner to view this page!");
        return;
      }
      // find all cars with owner = logged in user
      const q = query(
        collection(db, "cars"),
        where("owner", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      // iterate over the results
      const temp = [];
      querySnapshot.forEach((currDoc) => {
        temp.push({ ...currDoc.data(), id: currDoc.id });
      });

      // update the flatlist
      setCarList(temp);
    } catch (err) {
      console.log(err);
    }
  };

  const getRenter = async (renterId) => {
    const docSnap = await getDoc(doc(db, "userdata", renterId));
    return docSnap.data().name;
  }

  const cancelBooking = async (itemId) => {
    console.log("cancel booking for item: ", itemId);
    // update the car document to set the renter to null where the id = item.id and owner = auth.currentUser.uid
    const carRef = doc(db, "cars", itemId);
    await updateDoc(carRef, {
      renter: null,
      bookingcode: null,
    });
    // update the carList state to remove the item
    setCarList((prev) => prev.filter((car) => car.id !== itemId));
    alert("Booking cancelled successfully!");
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
      
      <View style={styles.container}>
        {errorMessage !== "" && <Text>{errorMessage}</Text>}
        {errorMessage === "" && (
          <FlatList
            data={carList}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={({ item }) => {
              return (
                <View style={styles.row}>
                  <Image
                    style={{ width: 160, height: 110 }}
                    source={{uri: item.photo,}}
                  />
                  <View>
                    <Text style={styles.bold}>{item.model}</Text>
                    <Text>License Plate: {item.licensePlate}</Text>
                    <Text>Price: ${item.price}</Text>
                    {item.renter === null ? (
                      <Text>Renter: N/A</Text>
                    ) : (
                      <View>
                        <Text>Renter: {getRenter(item.renter)}</Text>
                        <Text style={styles.bold}>Confirmation #: {item.bookingcode}</Text>
                        <Pressable style={styles.cancelBtn} onPress={()=>cancelBooking(item.id)}>
                          <Text style={styles.btnLabel}>Cancel Booking</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.hr}></View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};
export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  cancelBtn: {
    marginTop: 5,
    borderWidth: 1,
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 4,
    marginVertical: 2,
  },
  btnLabel: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    color: "blue",
  },
  row: {
    flexDirection: "row",
    gap: 13,
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
  hr:{
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
});
