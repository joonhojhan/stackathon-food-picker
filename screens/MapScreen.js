import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Button } from 'react-native-elements';
import get from 'lodash/get';
import pick from 'lodash/pick';
import MapView, { Marker } from 'react-native-maps';

import YelpService from '../services/yelp';
// import Map from '../components/Map';

const deltas = {
	latitudeDelta: 0.03,
	longitudeDelta: 0.03,
};
const styles = {
	filters: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	button: {
		marginTop: 65,
	},
	container: {
		width: '100%',
		height: '80%',
	},
};

export default class MapScreen extends Component {
	filterButtons = [
		{
			label: 'Random Food',
			color: '#000000',
			filter: { radius: 2000, open_now: true },
		},
	];

	state = { userLocation: null, location: null, errorMessage: null, food: [] };

	componentWillMount() {
		this.getLocationAsync();
	}

	renderMarker() {
		const { userLocation, food } = this.state;
		return food.map((place, key) => {
			let oops = {
				latitude: get(userLocation, 'coords.latitude', null),
				longitude: get(userLocation, 'coords.longitude', null),
			};
			if (!place) {
				return (
					<Marker
						key={key}
						title="Current Location"
						coordinate={oops}
						description="Oops, we couldn't find anything for you to eat :/"
					/>
				);
			}
			return (
				<Marker
					key={key}
					title={place.name}
					coordinate={place.coords}
					description={`Address: ${place.address}\nRating: ${
						place.rating
					} stars\nOpen: ${
						!place.is_closed ? 'Yes' : 'No'
					}\nCategory: ${place.categories
						.map(category => category.title)
						.join(', ')}`}
				/>
			);
		});
	}

	animate(region) {
		this.mapView.animateToRegion(region, 500);
	}

	getFood = async filter => {
		const randomPick = Math.floor(Math.random() * 30);
		const coords = get(this.state.userLocation, 'coords');
		const userLocation = pick(coords, ['latitude', 'longitude']);
		let food = await YelpService.getFood(userLocation, filter);
		this.setState({ food: [food[randomPick]] });
	};

	getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});
		}

		let userLocation = await Location.getCurrentPositionAsync({});
		await this.setState({ userLocation });
		// this.getFood();
	};

	animate(region) {
		this.mapView.animateToRegion(region, 750);
	}

	handleFilterPress = async filter => {
		const { food } = this.state;
		await this.getFood(filter);
		// console.log(this.state.food[0].coords);
		await this.setState({ location: food[0] });
	};

	renderFilterButtons() {
		return this.filterButtons.map((button, i) => (
			<Button
				key={i}
				title={button.label}
				buttonStyle={{
					backgroundColor: button.color,
					...styles.button,
				}}
				onPress={async () => {
					await this.handleFilterPress(button.filter);
					const { location, userLocation } = this.state;
					let region;
					if (location) {
						region = {
							latitude: get(location, 'coords.latitude', null),
							longitude: get(location, 'coords.longitude', null),
							...deltas,
						};
					} else {
						region = {
							latitude: get(userLocation, 'coords.latitude', null),
							longitude: get(userLocation, 'coords.longitude', null),
							...deltas,
						};
					}
					this.animate(region);
				}}
			/>
		));
	}

	render() {
		const { userLocation } = this.state;
		let region = {
			latitude: get(userLocation, 'coords.latitude', null),
			longitude: get(userLocation, 'coords.longitude', null),
			...deltas,
		};
		if (!region.latitude || !region.longitude) {
			return (
				<View>
					<Text>Loading map...</Text>
				</View>
			);
		}
		return (
			<View style={{ flex: 7 }}>
				{/* <Map userLocation={userLocation} location={location} places={food} /> */}
				<MapView
					ref={ref => (this.mapView = ref)}
					style={styles.container}
					// region={region}
					initialRegion={region}
					showsUserLocation
					showsMyLocationButton
					provider="google"
				>
					{this.renderMarker()}
				</MapView>
				<View style={{ ...styles.filters }}>{this.renderFilterButtons()}</View>
			</View>
		);
	}
}

export { MapScreen };

MapScreen.navigationOptions = {
	header: null,
};
