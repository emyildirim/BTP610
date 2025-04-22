import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";

import { db, auth } from "../firebaseConfig";
import {
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  collection,

} from "firebase/firestore";

const RentalFormScreen = () => {

  const [carModel, setCarModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [cost, setCost] = useState(0);
  const [photo, setPhoto] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //EXAMPLE listing to create
  // Audi A4 2012
  // AUA412
  // 133
  //https://media.ed.edmunds-media.com/audi/a4/2012/oem/2012_audi_a4_wagon_20t-avant-premium-quattro_fq_oem_1_1600.jpg
  // 32 Troyer Ct
  // Thornhill

  const createRentalCar = async () => {
    try {
      // 1. create a new car
      const car = {
        address: address,
        city: city,
        licensePlate: licensePlate,
        model: carModel,
        owner: auth.currentUser.uid,
        photo: photo,
        price: cost,
        renter: null,
        bookingcode: null,
      };
      const docRef = await addDoc(collection(db, "cars"), car);
      console.log("Document successfully updated!");
      setCarModel("");
      setLicensePlate("");
      setCost(0);
      setPhoto("");
      setCity("");
      setAddress("");
      setErrorMessage("Car listed successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>List a Car</Text>
      <TextInput
        placeholder="Car Model"
        onChangeText={setCarModel}
        value={carModel}
        style={styles.tb}
      />
      <TextInput
        placeholder="License Plate"
        onChangeText={setLicensePlate}
        value={licensePlate}
        style={styles.tb}
      />
      <TextInput
        placeholder="Cost"
        onChangeText={setCost}
        value={cost}
        style={styles.tb}
      />
      <TextInput
        placeholder="Photo URL"
        onChangeText={setPhoto}
        value={photo}
        style={styles.tb}
      />
      <TextInput
        placeholder="City"
        onChangeText={setCity}
        value={city}
        style={styles.tb}
      />
      <TextInput
        placeholder="Address"
        onChangeText={setAddress}
        value={address}
        style={styles.tb}
      />

      <Pressable onPress={createRentalCar} style={styles.darkBtn}>
        <Text style={styles.btnLabel}>Create Listing</Text>
      </Pressable>

      <Text>{errorMessage}</Text>
    </View>
  );
};
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
    gap: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default RentalFormScreen;
