"use client"

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, Alert, Platform, BackHandler, ActivityIndicator, Text } from "react-native";

// Import the HTML content from the JSON file
import flipperData from './flipperContent.json';

const FlipperComponent: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior (exit app)
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }
  }, [canGoBack]);
  
  const handleLoadEnd = () => {
    setIsLoading(false);
    console.log("WebView loaded successfully");
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    setIsLoading(false);
    Alert.alert("Error", "Failed to load the book. Please try again later.");
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'pageChange') {
        console.log(`Current page in WebView: ${data.currentPage + 1}`);
        // You can use this data to update the native UI if needed
      }
    } catch (error) {
      console.log("Raw message from WebView:", event.nativeEvent.data);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading Book...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        // Use the imported HTML from the JSON object
        source={{ html: flipperData.html }}
        style={[styles.webView, { opacity: isLoading ? 0 : 1 }]}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={false}
        originWhitelist={["*"]}
        androidLayerType="hardware"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e1a26",
    zIndex: 1000,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
});

export default FlipperComponent;