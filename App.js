import React, {PureComponent} from 'react';
import { FlatList, ActivityIndicator,Button, View, Text, Image, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Home Screen'
	};
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<Button
          title="Cameras"
          onPress={() => this.props.navigation.navigate('Cameras')}
        />
      </View>
    );
  }
}

class Cameras extends React.PureComponent {
	static navigationOptions = {
    title: 'Cameras',
  };

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://web6.seattle.gov/Travelers/api/Map/Data?zoomId=17&type=2')
      .then((response) => response.json())
      .then((responseJson) => {
		var arr = [];
        this.setState({
          isLoading: false,
          dataSource: responseJson.Features,
		  data: arr
        }, function(){
			for(var featureIdx in this.state.dataSource){
				var camerasObj = this.state.dataSource[featureIdx]["Cameras"];
				for(var cameraIdx in camerasObj){
					//this.state.data.push(camerasObj[cameraIdx]['Type']);
					var url = "";
					if(camerasObj[cameraIdx]['Type']==('sdot')){
						url = "http://www.seattle.gov/trafficcams/images/" + camerasObj[cameraIdx]['ImageUrl'];
					}
					else{
						url = "http://images.wsdot.wa.gov/nw/" + camerasObj[cameraIdx]['ImageUrl'];
					}
					this.state.data.push({Description: camerasObj[cameraIdx]['Description'], 
						  imgUrl: url});
				}
			
			}			
		});
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
	
    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => 
		  <View style={{flex:1, flexDirection: 'row'}}> 
			<Image source = {{ uri: item.imgUrl }} style={styles.imageView} />
			<Text style={styles.textView}>{item.Description}</Text>		
			</View>
			}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
	imageView: {
    width: '50%',
    height: 100 ,
    margin: 7,
    borderRadius : 1
 
},
textView: {

    width:'50%', 
    textAlignVertical:'center',
    padding:10,
    color: '#000'
 
}
});

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Cameras: Cameras,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}