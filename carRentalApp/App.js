import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from "./LoginScreen";
import CreateListingScreen from './ownerScreens/CreateListingScreen';
import ListingsScreen from './ownerScreens/ListingsScreen';
import BookingsScreen from "./renterScreens/BookingsScreen";
import SearchScreen from "./renterScreens/SearchScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
 
  const OwnerApp = () =>  {
    return(
      <Tab.Navigator>
        <Tab.Screen component={ListingsScreen} name="My Listings"/>
        <Tab.Screen component={CreateListingScreen} name="Create Listing"/>
      </Tab.Navigator>
    )
  }

  const RenterApp = () =>  {
    return(
      <Tab.Navigator>
        <Tab.Screen component={BookingsScreen} name="My Bookings"/>
        <Tab.Screen component={SearchScreen} name="Search"/>
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>        
        <Stack.Screen name="Login Screen" component={LoginScreen} />        
        <Stack.Screen name="Owner" component={OwnerApp} options={{headerShown:false}}/>        
        <Stack.Screen name="Renter" component={RenterApp} options={{headerShown:false}}/>  
      </Stack.Navigator>
    </NavigationContainer>
  )
}
