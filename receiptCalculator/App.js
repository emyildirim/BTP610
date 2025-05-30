import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OrderScreen from "./screens/OrderScreen";
import ReceiptScreen from "./screens/ReceiptScreen";

const Stack = createStackNavigator();

export default function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator initialRouteName="OrderScreen">
       <Stack.Screen name="OrderScreen" component={OrderScreen} />
       <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
     </Stack.Navigator>
   </NavigationContainer>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#fff",
   alignItems: "center",
   justifyContent: "center",
 },
});
