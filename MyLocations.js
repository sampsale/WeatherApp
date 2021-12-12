
import React from 'react';
import { StyleSheet, Text, View,  TextInput,  Alert, FlatList } from 'react-native';
import { Icon, Input, Button, ListItem, Divider } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('Locations.db');


export default function MyLocations({navigation}) {
    const [location, setLocation] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [locations, setLocations] = React.useState([])

    React.useEffect(() => {
        db.transaction(tx => {
          tx.executeSql('create table if not exists locationslist (id integer primary key not null, location text, address text);');
        });
        updateList();    
    }, []);

    const updateList = () => {
        console.log('updatelist')
        db.transaction(tx => {
          tx.executeSql('select * from locationslist;', [], (_, { rows }) =>
            setLocations(rows._array)
          ); 
        });
      }

    const addLocation = () =>{
        db.transaction(tx=>{
            console.log(location, address)
            tx.executeSql('insert into locationslist (location, address) values (?, ?);', [location, address]);}, 
            null, updateList
          )
        setLocation('')
        setAddress('')
    }

    const deleteItem = (id) => {
        db.transaction(
          tx => {
            tx.executeSql(`delete from locationslist where id = ?;`, [id]);
          }, null, updateList
        )    
      }

    return (
    <View style={styles.container}>
    <Divider orientation="horizontal" />
    <View style={styles.textinput}>
      <Input
        onChangeText={location=>setLocation(location)}
        value={location}
        label='Location'
        multiline={true}
        placeholder='Type in location'
      />
      <Input
        onChangeText={address=>setAddress(address)}
        value={address}
        label='Address'
        multiline={true}
        placeholder='Type in address'
      />
       <Button
       iconPosition='left'
       onPress={addLocation}
            icon={
                <Icon
                name="save"
                size={45}
                color="white"
                />  }
            title="Save"
/>
      </View>
      <View style={styles.flatlist}>
          
      <FlatList   data ={locations} keyExtractor={(item, index) => index.toString()} renderItem={({  item}) =>
            <ListItem bottomDivider>
            <ListItem.Content>      
                <ListItem.Title >{item.location}  </ListItem.Title>
                <Divider orientation="horizontal" width={3} />
            </ListItem.Content>
            <Icon type="material" reversecolor="lightblue" name="arrow-forward-ios" color='gray'  onPress={() => navigation.navigate('Weather',
            {location : {item}}
            )} />            
            <Text style={{fontSize: 10, color: 'red'}} onPress={() => deleteItem(item.id)}  > Delete location</Text>
            </ListItem>}/>

      </View>
    </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      padding : 15
    },
    textinput:{
    }, flatlist:{
      justifyContent: 'space-between',
      flex: 0.9,
      width: 300
      
    },
    
  });