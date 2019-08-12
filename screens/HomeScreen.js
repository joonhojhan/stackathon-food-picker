import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		paddingTop: 30,
		marginVertical: '35%',
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginTop: 3,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	textStyle: {
		fontSize: 20,
		alignSelf: 'center',
		textAlign: 'center',
		marginTop: 25,
	},
	title: {
		fontSize: 36,
		alignSelf: 'center',
		textAlign: 'center',
		marginBottom: 25,
	},
});

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View>
					<Text style={styles.title}>What Do You Want?</Text>
				</View>
				<View
					style={{
						...styles.welcomeContainer,
						flexDirection: 'column',
					}}
				>
					<Image
						source={{
							uri:
								'https://icon-library.net/images/yelp-app-icon/yelp-app-icon-20.jpg',
						}}
						style={styles.welcomeImage}
					/>
				</View>
				<View style={styles.getStartedContainer}>
					<Text style={styles.textStyle}>
						{
							'Hey! This app uses the Yelp API and react-native-maps with Google as the provider to help you decide where to eat...'
						}
					</Text>
					<Text style={styles.textStyle}>Randomly... >:)</Text>
					<Text style={styles.textStyle}>
						Let me help you choose what to eat!
					</Text>
				</View>
			</View>
		</View>
	);
}

HomeScreen.navigationOptions = {
	header: null,
};
