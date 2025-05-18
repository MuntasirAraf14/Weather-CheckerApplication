import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
  // TouchableOpacity, // Keep if you plan to add a button
  ActivityIndicator,
  ImageBackground, // <--- Import ImageBackground
} from 'react-native';

// --- Define your image assets ---
// List all the images you want to use as potential backgrounds.
// Make sure the paths are correct relative to your App.js file.
// If assets is in the root, and App.js is in the root: './assets/filename.ext'
// If App.js is in src/ and assets is in root: '../assets/filename.ext'
// For Snack, it's usually './assets/filename.ext' if assets is a top-level folder.
const backgroundImages = [
  require('./assets/light-cloud.png'), // Replace with your actual image file names
  require('./assets/heavy-cloud.png'),
  require('./assets/thunder.png'),
  // Add more require statements for each image in your assets folder
  // e.g., require('./assets/my_cool_image.jpg'),
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // --- Select a random background image ---
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedBackgroundImage = backgroundImages[randomIndex];

    this.state = {
      city: 'Gazipur',
      weather: 'Light Cloud',
      temperature: 24,
      searchText: '',
      loading: false,
      error: null,
      backgroundImage: selectedBackgroundImage, // Add to state
    };
  }

  // Function to handle city search
  handleUpdateCity = () => {
    const { searchText } = this.state;

    if (searchText.trim() === '') return;

    this.setState({ loading: true });

    setTimeout(() => {
      const conditions = ['Light Cloud', 'Sunny', 'Heavy Rain', 'Thunderstorm', 'Partly Cloudy', 'Clear', 'Foggy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 35) + 5;

      // Optional: Select a new random background on update as well
      // const newRandomIndex = Math.floor(Math.random() * backgroundImages.length);
      // const newSelectedBackgroundImage = backgroundImages[newRandomIndex];

      this.setState({
        city: searchText,
        weather: randomCondition,
        temperature: randomTemp,
        searchText: '',
        loading: false,
        // backgroundImage: newSelectedBackgroundImage, // Uncomment if you want bg to change on update
      });
    }, 1000);
  }

  // Handle text input changes
  handleTextChange = (text) => {
    this.setState({ searchText: text });
  }

  render() {
    const { city, weather, temperature, searchText, loading, backgroundImage } = this.state;

    return (
      // --- Use ImageBackground as the main container ---
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImageContainer}
        resizeMode="cover" // Or 'stretch', 'contain' depending on your preference
      >
        {/* Optional: Add an overlay for better text readability */}
        <View style={styles.overlay}>
          <View style={styles.contentContainer}> {/* Renamed from styles.container to avoid conflict */}
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" /> // Changed color for dark overlay
            ) : (
              <>
                <Text style={[styles.largeText, styles.textStyle]}>{city}</Text>
                <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                <Text style={[styles.largeText, styles.textStyle]}>{temperature}°C</Text>
              </>
            )}

            <View style={styles.searchContainer}>
              <TextInput
                autoCorrect={false}
                placeholder="Search any city"
                placeholderTextColor="rgba(255,255,255,0.7)" // Lighter for dark background
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

const styles = StyleSheet.create({
  backgroundImageContainer: { // Style for the ImageBackground
    flex: 1,
    width: '100%',
    height: '100%',
    // No backgroundColor needed here as the image will cover it
  },
  overlay: { // Optional overlay
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent black overlay
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: { // Your original container, now for content inside the overlay
    // No flex: 1 here if overlay has it.
    alignItems: 'center',
    justifyContent: 'center',
    // Removed backgroundColor from here
    width: '90%', // Optional: constrain content width
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white', // Make text white for readability on potentially dark backgrounds
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add text shadow for better contrast
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  largeText: {
    fontSize: 44,
    fontWeight: 'bold', // Added for emphasis
    marginBottom: 5, // Added some spacing
  },
  smallText: {
    fontSize: 20, // Slightly larger
    marginBottom: 10, // Added some spacing
  },
  textInput: {
    backgroundColor: 'rgba(100, 100, 100, 0.7)', // Semi-transparent background for input
    color: 'white',
    height: 45, // Slightly increased height
    width: 300,
    marginTop: 20,
    // marginHorizontal: 20, // Not strictly necessary if contentContainer manages width
    paddingHorizontal: 15,
    borderRadius: 25, // More rounded
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: 10, // Reduced margin a bit
  },
  // searchButton: { ... } // Keep if you plan to add a button
  // buttonText: { ... }
});