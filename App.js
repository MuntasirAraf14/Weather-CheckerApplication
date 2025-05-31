import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Keyboard, // <-- Import Keyboard
} from 'react-native';

// --- Define your image assets with specific weather conditions ---
// It's better to map conditions to images rather than using a random array.
const weatherImages = {
  'Clear': require('./assets/clear.png'),
  'Sunny': require('./assets/clear.png'), // You might use the same as 'Clear'
  'Rain': require('./assets/light-rain.png'),
  'Drizzle': require('./assets/light-rain.png'),
  'Clouds': require('./assets/light-cloud.png'), // For 'Partly Cloudy' etc.
  'Thunderstorm': require('./assets/thunder.png'),
  'Snow': require('./assets/snow.png'),
  
  
  'Default': require('./assets/heavy-cloud.png'), // A fallback image
};

// --- Your API Key from OpenWeatherMap ---
// NOTE: For a real app, never hardcode API keys. Use a config file or environment variables.
// For Expo Snack, this is okay for demonstration.
const API_KEY = '2dbd12d25f053b4645368adcfb8039d3'; 

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: 'Gazipur',
      weather: '', // Start empty, will be fetched
      temperature: 0, // Start at 0
      searchText: '',
      loading: true, // Start loading as we will fetch data on mount
      error: null,
      backgroundImage: weatherImages['Default'], // Start with a default background
    };
  }

  // --- NEW: Fetch data when the component first loads ---
  componentDidMount() {
    this.fetchWeatherData(this.state.city);
  }

  // --- NEW: Helper function to get the correct background image ---
  getBackgroundImageForWeather = (weather) => {
    // OpenWeatherMap returns a "main" condition like 'Clouds', 'Rain', 'Clear'.
    return weatherImages[weather] || weatherImages['Default'];
  };

  // --- REWRITTEN: Function to fetch weather data from the API ---
  fetchWeatherData = async (cityName) => {
    if (cityName.trim() === '') return;

    this.setState({ loading: true, error: null });
    Keyboard.dismiss(); // Dismiss the keyboard for a better UX

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        // If the server response is not 200-299, throw an error
        throw new Error('City not found. Please try again.');
      }

      const data = await response.json();

      // Successfully fetched data, now update the state
      this.setState({
        city: data.name,
        weather: data.weather[0].main, // e.g., 'Clouds', 'Rain'
        temperature: Math.round(data.main.temp),
        loading: false,
        backgroundImage: this.getBackgroundImageForWeather(data.weather[0].main),
      });

    } catch (error) {
      // If any error occurs during fetch or processing
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  // --- MODIFIED: This function now calls our API fetcher ---
  handleUpdateCity = () => {
    this.fetchWeatherData(this.state.searchText);
    this.setState({ searchText: '' }); // Clear input after search
  };

  handleTextChange = (text) => {
    this.setState({ searchText: text });
  };

  render() {
    const { city, weather, temperature, searchText, loading, error, backgroundImage } = this.state;

    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <>
                {/* --- NEW: Display error message if it exists --- */}
                {error && (
                  <Text style={[styles.smallText, styles.textStyle, styles.errorText]}>
                    {error}
                  </Text>
                )}
                <Text style={[styles.largeText, styles.textStyle]}>{city}</Text>
                <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                <Text style={[styles.largeText, styles.textStyle]}>{temperature}°C</Text>
              </>
            )}

            <View style={styles.searchContainer}>
              <TextInput
                autoCorrect={false}
                placeholder="Search any city"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                clearButtonMode="always"
                value={searchText}
                onChangeText={this.handleTextChange}
                onSubmitEditing={this.handleUpdateCity}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// --- Styles are mostly the same, with one addition for error text ---
const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  largeText: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  smallText: {
    fontSize: 20,
    marginBottom: 10,
  },
  // --- NEW Style for error message ---
  errorText: {
    color: '#f9a8a8', // A light red color for visibility
    backgroundColor: 'rgba(150, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    color: 'white',
    height: 45,
    width: 300,
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});