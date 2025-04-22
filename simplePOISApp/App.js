import * as Location from "expo-location";
import MapView, {Marker, Callout} from 'react-native-maps'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";

export default function App() {

  const [locationLatitude, setLocationLatitude] = useState(null);
  const [locationLongitude, setLocationLongitude] = useState(null);
  const [markersList, setMarkersList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(()=>{
    if(locationLatitude && locationLongitude){
      getData("accommodation,catering", locationLongitude, locationLatitude, "5000", "25");
    }
  }, [locationLatitude, locationLongitude])

  const requestPermissions = async () => {
    try {
      const permissionsObject = await Location.requestForegroundPermissionsAsync();
      if (permissionsObject.status === "granted") {
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
      console.log("fetching current location")
      const location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
      setLocationLatitude(location.coords.latitude);
      setLocationLongitude(location.coords.longitude);
      console.log("location done")
    } catch (err) {
      console.log(err);
    }
  }

  const getData = async (categories, lon, lat, km, numOfResults) => {
    try{
      console.log("fetching markers")
      const response = await fetch(`https://api.geoapify.com/v2/places?categories=${categories}&conditions=named&filter=circle:${lon},${lat},${km}&limit=${numOfResults}&apiKey=20e1e95a19a143cea29dcc6e1e40acc6`)
      const data = await response.json();
      console.log("markers done")
      setMarkersList(data.features)
    }catch(err){
      setErrorMsg(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What's Nearby?</Text>
      <Text style={styles.description}>Displaying hotels and restaurants near you.</Text>
      {locationLatitude && locationLongitude && markersList ? <MapView region={{latitude: locationLatitude, longitude:locationLongitude, latitudeDelta: 0.05, longitudeDelta: 0.05}} style={styles.map}>
        {markersList.map( (obj, index) => (
          <Marker key={index} coordinate={{latitude:obj.properties.lat, longitude:obj.properties.lon,}}> 
            <Callout tooltip> 
              <View style={styles.calloutContainer}> 
              {obj.properties.categories.includes("catering") 
              ? <MaterialIcons name="restaurant" size={24} color="black" /> : <MaterialIcons name="hotel" size={24} color="black" />}
                <Text style={styles.calloutTitle}>{obj.properties.name}</Text> 
                <Text style={styles.calloutDescription}>{obj.properties.address_line2}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView> : <Text>Loading...</Text>}
      <StatusBar style="auto" />
      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  calloutContainer: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: -10,
  },
  calloutTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 5 
  },
  calloutDescription: { 
    fontSize: 12 
  },
  title: {
    fontSize: 20,
  },
  description:{
    marginVertical: 8,
  },
  map: {
    width: "90%",
    height: "90%",
    borderWidth: 1,
  },
});
