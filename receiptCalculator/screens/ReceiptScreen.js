import { StyleSheet, Text, View, Pressable} from 'react-native';
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import order from "../modules/common.js"

const ReceiptScreen = ({navigation}) => {

  const [items, setItems] = useState(order[1]);
  const [prices, setPrices] = useState(order[0]);
  const [subTotal, setSubTotal] = useState(0);
  const [confirmCode, setComfirmCode] = useState(0);

  useEffect(()=>{
     navigation.setOptions({        
        headerLeft: () => (
           <View style={styles.row}>
              <Pressable style={{marginLeft: 10}} onPress={goBack}>
                  <AntDesign name="back" size={24} color="black" />
              </Pressable>              
           </View>
         ), title: "Checkout",
         headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
     })   
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      const randomValue = Math.floor(Math.random() * (100000 - 999999 + 1) + 999999);
      setComfirmCode(randomValue);
      setItems(order[1]);
      setPrices(order[0]);
      setSubTotal(items.quantity * (prices.burger + (items.isLarge ? prices.large : 0)) + (items.isfastDelivery ? prices.fastDelivery : 0));
    }, [order])
  );

  const goBack = () => {
    navigation.navigate("OrderScreen");
  };
  
  return(
     <View style={styles.container}>
        <Text style={{color:"blue", fontSize:18, fontWeight:"bold", textAlign:"center"}}>
         Receipt
        </Text>  
        <View style={styles.divider}></View>
        {items && prices && (
         <View>
            <Text style={styles.text}>Confirmation #: {confirmCode}</Text>
            <Text style={styles.text}>Item(s): {items.quantity}{items.isLarge ? " Large" : ""} {items.name}</Text>
         <Text style={styles.text}>Delivery: {items.isfastDelivery ? "Fast" : "Normal"}</Text>
         <View style={styles.divider}></View>
            <View >
                <View style={styles.rowContainer}> 
                    <Text style={styles.title}>Name</Text>
                     <Text style={styles.title}>Qty</Text>
                     <Text style={styles.title}>Price</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.text}>Burger</Text>
                     <Text style={styles.text}>{items.quantity}</Text>
                     <Text style={styles.text}>${prices.burger}</Text>
                </View>
                {items.isLarge &&
                  <View style={styles.rowContainer}>
                     <Text style={styles.text}>Large</Text>
                     <Text style={styles.text}>{items.quantity}</Text>
                     <Text style={styles.text}>${prices.large.toPrecision(3)}</Text>
                  </View>
                }
                {items.isfastDelivery ?
                  <View style={styles.rowContainer}>
                     <Text style={styles.text}>Delivery Fee</Text>
                     <Text style={styles.text}>${prices.fastDelivery.toPrecision(3)}</Text>
                  </View>
                  : 
                  <View style={styles.rowContainer}>
                     <Text style={styles.text}>Delivery Fee</Text>
                     <Text style={styles.text}>$0.00</Text>
                  </View>
                }
                  <View style={styles.divider}></View>
                <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                     <Text style={styles.text}>Subtotal: ${subTotal}</Text>
                </View>
                <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                     <Text style={styles.text}>Tax: ${(subTotal * 0.13).toPrecision(3)}</Text>
                </View>
                <View style={{flexDirection:"row", justifyContent:"flex-end", marginTop:10}}>
                     <Text style={styles.title}>Total: ${(subTotal + subTotal * 0.13).toPrecision(4)}</Text>
                </View>
            </View>
         </View>
        )}
        
     </View>
  )
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      justifyContent:"center",
      padding:"20",      
   },
   text:{
      fontSize:16,
   },
   divider:{
      borderWidth:1,
      borderColor:"#dfdfdf",
      marginVertical:10,
  },
  rowContainer : {
   flexDirection:"row",
   justifyContent:"space-between",
   alignItems:"center"
   },
   title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
   },
});

export default ReceiptScreen;