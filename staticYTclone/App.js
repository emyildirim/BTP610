import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require("./assets/bg2.png")} 
        style={{width: '100%', height: '100%'}}>
        {/* TOP */}
        <View style={{height: '50%', paddingTop: 60, paddingHorizontal: 20,}}>
          {/* Top Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 26, fontWeight: 700}}>Shorts</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Ionicons name="search" size={28} color="white" />
              <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
            </View>
          </View>
          {/* Bottom Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 20 }}>
            <View style={styles.button}>
              <Entypo name="bell" size={24} color="black" />
              <Text>Subscriptions</Text>
            </View>
            <View style={styles.button}>
              <MaterialIcons name="live-tv" size={24} color="black" />
              <Text>Live</Text>
            </View>
            <View style={styles.button}>
              <Entypo name="shopping-cart" size={24} color="black" />
              <Text>Shopping</Text>
            </View>
          </View>
        </View>
        
        {/* BOTTOM */}
        <View style={{height: '50%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 40, paddingHorizontal: 20,}}>
          {/* Left */}
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 }}>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Image source={require("./assets/user.png")} 
                style={{width: 25, height: 25}}/>
              <Text style={{color: 'white', fontWeight: 700}}>@NileRed</Text>
              <Text style={styles.button}>Subscribe</Text>
            </View>
            <Text style={{color: 'white', fontWeight: 700}}>Freezing my hand in hot ice</Text>
          </View>
          {/* Right */} 
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.box}>
              <AntDesign name="like1" size={28} color="white" style={styles.icon} />
              <Text style={styles.text}>687K</Text>
            </View>
            <View style={styles.box}>
              <AntDesign name="dislike1" size={28} color="white" style={styles.icon}/>
              <Text style={styles.text}>Dislike</Text>
            </View>
            <View style={styles.box}>
              <FontAwesome name="commenting" size={28} color="white" style={styles.icon}/>
              <Text style={styles.text}>4.1K</Text>
            </View>
            <View style={styles.box}>
              <Fontisto name="share-a" size={28} color="white" style={styles.icon}/>
              <Text style={styles.text}>Share</Text>
            </View>
          </View>
        </View>
      
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box:{
    alignItems: 'center',
    paddingTop: 30,
  },
  icon: {
    padding: 7,
  },
  text: {
    color: "white",
    fontWeight: 500,
  }, button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10, 
    paddingVertical: 9, 
    borderRadius: 20,
  },
});