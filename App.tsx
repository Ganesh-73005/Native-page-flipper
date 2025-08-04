import type React from "react"
import { SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native"
// import BookFlipperWebView from "./src/components/BookFlipperWebView" // You can keep this or remove it
import PdfFlipper from "./src/components/PdfFlipper" // Import the new component
import BookFlipperWebView from "./src/components/BookFlipperWebView";
// A sample PDF file for demonstration. Replace with your own PDF URL.
const SAMPLE_PDF_URL = "https://www.princexml.com/samples/newsletter/drylab.pdf";

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0e1a26"
        translucent={Platform.OS === "android"}
        hidden={false}
      />
     
      
      {/*    <PdfFlipper uri={SAMPLE_PDF_URL} /> Uncomment the line below to use the PdfFlipper component */}
     <BookFlipperWebView />
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a26",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
})

export default App
