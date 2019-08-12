import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import get from 'lodash/get';

const deltas = {
	latitudeDelta: 0.03,
	longitudeDelta: 0.03,
};

const initialRegion = {
	latitude: 37.321996988,
	longitude: -122.0325472123455,
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '80%',
	},
});

export default class Map extends Component {
	renderMarker() {
		return this.props.places.map((place, key) => (
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
		));
	}

	animate(region) {
		this.mapView.animateToRegion(region, 500);
	}

	render() {
		const { location, userLocation } = this.props;
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

		if (!region.latitude || !region.longitude) {
			return (
				<View>
					<Text>Loading map...</Text>
				</View>
			);
		}

		return (
			<MapView
				ref={ref => (this.mapView = ref)}
				style={styles.container}
				// region={region}
				initialRegion={{ ...initialRegion, ...deltas }}
				showsUserLocation
				showsMyLocationButton
				provider="google"
			>
				{this.renderMarker()}
			</MapView>
		);
	}
}
