import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const SearchScreen = () => {
  // Current location state
  const [locationLatitude, setLocationLatitude] = useState(null);
  const [locationLongitude, setLocationLongitude] = useState(null);

  // Data from Firestore
  const [allCars, setAllCars] = useState([]);

  // Marker locations
  const [markersList, setMarkersList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Selected car states
  const [isCarSelected, setIsCarSelected] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [bookingCode, setBookingCode] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      (async () => {
        try {
          const docSnap = await getDoc(doc(db, "userdata", selectedCar.owner));
          if (docSnap.exists()) {
            setOwnerName(docSnap.data().name);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [selectedCar]);

  useFocusEffect(
    useCallback(() => {
      getAllCars();
      setErrorMsg("");
      return () => {
        setErrorMsg("");
        setSelectedCar(null);
      };
    }, [locationLatitude, locationLongitude, bookingCode])
  );

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        alert("Permission granted!");
        getCurrLocation();
      } else {
        alert("Permission denied or not provided");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocationLatitude(location.coords.latitude);
      setLocationLongitude(location.coords.longitude);
      console.log("Current location loaded.");
    } catch (err) {
      console.log(err);
    }
  };

  const getLocation = async (city, address) => {
    try {
      const geocodedLocation = await Location.geocodeAsync(
        `${address}, ${city}`
      );
      const result = geocodedLocation[0];
      if (!result) {
        alert("No coordinates found");
        return;
      }
      return {
        latitude: result.latitude,
        longitude: result.longitude,
      };
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const tempCars = [];
      const tempLocations = [];

      querySnapshot.forEach((currDoc) => {
        tempCars.push({ ...currDoc.data(), id: currDoc.id });
      });

      for (let i = 0; i < tempCars.length; i++) {
        const coordinates = await getLocation(
          tempCars[i].city,
          tempCars[i].address
        );
        tempLocations.push({ coordinates });
      }

      setAllCars(tempCars);
      setMarkersList(tempLocations);
      console.log("All map data loaded.");
    } catch (err) {
      console.log("Error fetching cars", err);
      setErrorMsg(err.message);
    }
  };

  const handleCarSelected = (car) => {
    setIsCarSelected(true);
    setSelectedCar(car);
    //console.log("Car selected");
  };

  const handleBooking = async () => {
    try {
      //clean the error message
      setErrorMsg("");

      //check if a car is already booked by the user
      const bookedCar = allCars.find(
        (car) => car.renter === auth.currentUser.uid
      );
      if (bookedCar) {
        //remove the booking
        const carRef = doc(db, "cars", bookedCar.id);
        await updateDoc(carRef, {
          renter: null,
          bookingcode: null,
        });
      }
      const bookingCode = generateBookingCode();
      setBookingCode(bookingCode);
      const carRef = doc(db, "cars", selectedCar.id);
      await updateDoc(carRef, {
        renter: auth.currentUser.uid,
        bookingcode: bookingCode,
      });
      setSelectedCar({ ...selectedCar, renter: auth.currentUser.uid });
      setIsCarSelected(false);
      alert(`Booked successfully; car location: ${selectedCar.address}, ${selectedCar.city}`);
    } catch (err) {
      console.log("Error booking car", err);
      setErrorMsg(err.message);
    }
  }

  const generateBookingCode = () => {
    const min = 100000,
      max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Book a Car Near You</Text>
      {locationLatitude &&
      locationLongitude &&
      markersList.length !== 0 &&
      allCars.length !== 0 ? (
        <MapView
          region={{
            latitude: locationLatitude,
            longitude: locationLongitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          style={styles.map}
        >
          {allCars.map((item, index) => (
            <Marker
              key={item.id}
              coordinate={markersList[index].coordinates}
              onPress={() => handleCarSelected(item)}
            >
              <View style={styles.customMarker}>
                <Text style={{ fontWeight: "800" }}>${item.price}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      {errorMsg ? <Text>{errorMsg}</Text> : null}

      {isCarSelected && selectedCar && (
        <View style={styles.row}>
          <View style={{ marginRight: 10 }}>
            <Image
              style={{ width: 190, height: 110 }}
              source={{ uri: selectedCar.photo }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {selectedCar.model}
            </Text>
            <Text style={{ fontSize: 10, marginVertical: 5, backgroundColor: "#F6F4E7" }}>
              Owner: {ownerName || "Loading..."}
            </Text>
            <Text style={styles.text}>${selectedCar.price} total</Text>
            {selectedCar.renter === null ? (
              <Pressable style={{ }}
                onPress={handleBooking}>
                <Text style={styles.button}>Book Now</Text>
              </Pressable>
            ) : selectedCar.renter === auth.currentUser.uid ? (
                <Text style={styles.info} >Booked by You</Text>
            ) : (
              <Text style={styles.info}>Booked by Someone</Text>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    backgroundColor: "#F6F4E7",
  },
  map: {
    width: "97%",
    height: "75%",
    borderWidth: 1,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "black",
    color: "white",
    fontWeight: "bold",
    borderRadius: 5,
    textAlign: "center",
  },
  customMarker: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  info: { marginVertical: 15, color: "red", fontWeight: "bold" }
});

export default SearchScreen;
