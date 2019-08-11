import axios from 'axios';

const YELP_API_KEY =
	'Y0vqiPm8A17HQJmMLaoP8cNEmF44DaNCqfIUwP2HFvLxzGEf1pVHm4LskVkBBP081B-JaWQ2kLJaH7x99iwsx5FLqhK2P-9ZFfhQ0uMQ2LVLOhf9hD4JD4XJjnhNXXYx';

const api = axios.create({
	baseURL: 'https://api.yelp.com/v3',
	headers: {
		Authorization: `Bearer ${YELP_API_KEY}`,
	},
});

export const getFood = async (userLocation, filter = {}) => {
	try {
		const { data } = await api.get('/businesses/search', {
			params: {
				limit: 30,
				categories:
					'food,korean,chinese,sandwiches,burgers,american,pizza,italian,mexican,seafood,indian,thai,vietnamese',
				...userLocation,
				...filter,
			},
		});
		return data.businesses.map(business => {
			return {
				name: business.name,
				coords: business.coordinates,
				imageUrl: business.image_url,
				address: `${business.location.display_address}`,
				rating: business.rating,
				phone: business.display_phone,
				categories: business.categories,
				is_closed: business.is_closed,
			};
		});
	} catch (err) {
		console.error(err);
	}
};

export default { getFood };
