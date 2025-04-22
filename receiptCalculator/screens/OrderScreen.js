import React, { useState, useEffect } from "react";
import { View, TextInput, Switch, Button, Text, StyleSheet, Image } from "react-native";
import order from "../modules/common.js"

const OrderScreen = ({navigation}) => {

 const [quantity, setQuantity] = useState(0);
 const [isLarge, setIsLarge] = useState(false);
 const [isfastDelivery, setIsFastDelivery] = useState(false);
 const [error, setError] = useState(false);

 useEffect(()=>{
      navigation.setOptions({        
         headerLeft: false,
          title: "Order",
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#fffff',
      })   
   }, [navigation])

 const submitPressed = () => {
   if(quantity === 0 || quantity < 1){
     setError(true);
     return
   }
   order.length >= 2 ? order.pop() : order;
   setError(false);
   order.push({
     name: "Burger",
     quantity: quantity,
     isLarge: isLarge,
     isfastDelivery: isfastDelivery
   });
   navigation.navigate("ReceiptScreen")
 };

 const clearPressed = () => {
   setQuantity(0);
   setIsLarge(false);
   setIsFastDelivery(false);
 }

 return (
   <View style={styles.container}>
     <Image source={require("../assets/burger.jpg")} style={{width: "100%", height: 200}} />
     <Text style={styles.intro}>Welcome to Hello Burgers Restaurant! Enjoy delicious burgers made with fresh ingredients.</Text>
     <Text style={styles.label}>Burger Quantity (${order[0].burger})</Text>
     <TextInput
       style={styles.input}
       placeholder="Enter Number"
       value={quantity}
       onChangeText={(int) => {setQuantity(int);setError(false);}}
     />
     {error && <Text style={{color: "red"}}>Please enter a quantity!</Text>}

     <Text style={{fontSize: 16,fontWeight: "bold", marginTop: 20}}>Add Extra</Text>
      <View style={styles.divider}></View>
    
     <View style={styles.switchContainer}>
       <Text style={styles.label}>Large (+${order[0].large})</Text>
       <Switch
         value={isLarge}
         onValueChange={setIsLarge}
       />
     </View>

     <View style={styles.switchContainer}>
       <Text style={styles.label}>Fast Delivery (${order[0].fastDelivery})</Text>
       <Switch
         value={isfastDelivery}
         onValueChange={setIsFastDelivery}
       />
     </View>
     <View style={{flexDirection: "row", height: "25%", justifyContent: "space-evenly", alignItems: "flex-end"}}>
        <Button title="Confirm" onPress={submitPressed} />
        <Button title="Clear" onPress={clearPressed} />
     </View>
   </View>
 );
};


const styles = StyleSheet.create({
 container: {
   padding: 20,
   backgroundColor:"white",
 },
 label: {
   fontSize: 16,
   marginBottom: 8,
 },
 input: {
   height: 40,
   borderColor: "#ccc",
   borderWidth: 1,
   marginBottom: 16,
   paddingHorizontal: 8,
   borderRadius: 4,
 },
 switchContainer: {
   flexDirection: "row",
   alignItems: "center",
   marginBottom: 16,
   justifyContent:"space-between"
 },
 text: {
   fontSize:16,
 },
  divider:{
    borderWidth:1,
    borderColor:"#dfdfdf",
    marginVertical:10,
  },
  intro:{
    fontSize:16,
    marginBottom: 16,
    marginTop: 16,
    textAlign:"center"
  }
});


export default OrderScreen;