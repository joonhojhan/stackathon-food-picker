import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Button } from 'react-native-elements';
import get from 'lodash/get';
import pick from 'lodash/pick';

import YelpService from '../services/yelp';
import Map from '../components/Map';

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

	getFood = async filter => {
		const randomPick = Math.floor(Math.random() * 25);
		const coords = get(this.state.userLocation, 'coords');
		const userLocation = pick(coords, ['latitude', 'longitude']);
		let food = await YelpService.getFood(userLocation, filter);
		this.setState({ food: [food[randomPick]] });
		// this.setState({ food });
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

	handleFilterPress = async filter => {
		await this.getFood(filter);
		// console.log(this.state.food[0].coords);
		this.setState({ location: this.state.food[0] });
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
				onPress={() => this.handleFilterPress(button.filter)}
			/>
		));
	}

	render() {
		const { location, food, userLocation } = this.state;
		return (
			<View style={{ flex: 7 }}>
				<Map userLocation={userLocation} location={location} places={food} />

				<View style={{ ...styles.filters }}>{this.renderFilterButtons()}</View>
			</View>
		);
	}
}

const styles = {
	filters: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	button: {
		marginVertical: 4,
	},
};

export { MapScreen };

MapScreen.navigationOptions = {
	header: null,
};
