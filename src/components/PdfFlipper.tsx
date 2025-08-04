"use client"

import React, { useRef, useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, Alert, Platform, ActivityIndicator, Text } from "react-native";

interface PdfFlipperProps {
  // The URI for the PDF file to be displayed. Must be a public URL.
  uri: string;
}

const PdfFlipper: React.FC<PdfFlipperProps> = ({ uri }) => {
  const webViewRef = useRef<WebView>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching PDF...");

  useEffect(() => {
    // Fetch the PDF and convert it to a Base64 string.
    const fetchPdf = async () => {
      try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          // The result includes the data URL prefix, which we need to remove.
          const base64data = (reader.result as string).split(',')[1];
          setPdfBase64(base64data);
          setLoadingMessage("Loading PDF Viewer...");
        };
        reader.readAsDataURL(blob);

      } catch (error) {
        console.error("Error fetching PDF:", error);
        Alert.alert("Error", "Could not fetch the PDF file. Please check the URL.");
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [uri]);

  // The HTML content now receives the PDF data directly.
  const getHtmlContent = (base64Data: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>PDF Flipper</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
    <style>
        /* Styling remains the same */
        @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600&display=swap");
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Bricolage Grotesque", sans-serif; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        body, html { height: 100vh; width: 100vw; background: #0e1a26; overflow: hidden; display: flex; justify-content: center; align-items: center; touch-action: manipulation; }
        .container { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px; padding: 20px; }
        .book-container { position: relative; width: min(90vw, 400px); height: min(70vh, 500px); perspective: 1500px; transform-style: preserve-3d; }
        .page { position: absolute; width: 100%; height: 100%; background: white; border-radius: 8px; overflow: hidden; backface-visibility: hidden; transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1); transform-origin: left center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); display: flex; justify-content: center; align-items: center; }
        .page canvas { width: 100%; height: 100%; object-fit: contain; }
        .page.flipped { transform: rotateY(-180deg); }
        .page.loading-placeholder { background: #f0f0f0; }
        .page:not(.flipped)::after { content: ''; position: absolute; top: 0; right: 0; width: 3px; height: 100%; background: rgba(0, 0, 0, 0.05); }
        .controls { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
        .control-btn { background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease; backdrop-filter: blur(10px); touch-action: manipulation; min-width: 80px; }
        .control-btn:active { background: rgba(255, 255, 255, 0.4); transform: scale(0.95); }
        .control-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-indicator, .loading-text-html { color: white; font-size: 14px; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="loading-text-html" id="loading">Loading PDF...</div>
        <div class="book-container" id="bookContainer" style="display: none;"></div>
        <div class="controls" id="controls" style="display: none;">
            <button class="control-btn" id="prevBtn">← Prev</button>
            <button class="control-btn" id="nextBtn">Next →</button>
        </div>
        <div class="page-indicator" id="pageIndicator" style="display: none;"></div>
    </div>
    
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

        // Function to convert Base64 string to a Uint8Array
        function base64ToUint8Array(base64) {
            const binary_string = window.atob(base64);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        }

        const PDF_DATA = base64ToUint8Array('${base64Data}');

        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 0;
        let pages = [];
        let renderedPages = new Set();

        async function initializeBook() {
            try {
                // Load the PDF from the raw data array
                pdfDoc = await pdfjsLib.getDocument({ data: PDF_DATA }).promise;
                totalPages = pdfDoc.numPages;
                
                const bookContainer = document.getElementById('bookContainer');
                for (let i = 1; i <= totalPages; i++) {
                    const page = document.createElement('div');
                    page.className = 'page loading-placeholder';
                    pages.push(page);
                    bookContainer.appendChild(page);
                }

                document.getElementById('loading').style.display = 'none';
                bookContainer.style.display = 'block';
                document.getElementById('controls').style.display = 'flex';
                document.getElementById('pageIndicator').style.display = 'block';

                updatePageDisplay();
                setupEventListeners();

            } catch (error) {
                document.getElementById('loading').innerText = 'Error loading PDF.';
                console.error('Error loading PDF:', error);
            }
        }
        
        async function renderPage(pageNum) {
            if (renderedPages.has(pageNum) || !pdfDoc || pageNum < 1 || pageNum > totalPages) return;
            const pageElement = pages[pageNum - 1];
            if (!pageElement) return;
            try {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                pageElement.innerHTML = '';
                pageElement.appendChild(canvas);
                pageElement.classList.remove('loading-placeholder');
                renderedPages.add(pageNum);
            } catch(e) {
                console.error('Error rendering page ' + pageNum, e);
            }
        }

        function updatePageDisplay() {
            renderPage(currentPage);
            renderPage(currentPage + 1);
            renderPage(currentPage - 1);
            const rightStackSize = totalPages - (currentPage - 1);
            pages.forEach((page, index) => {
                const pageNum = index + 1;
                if (pageNum < currentPage) {
                    page.classList.add('flipped');
                    page.style.zIndex = rightStackSize + (currentPage - pageNum);
                } else {
                    page.classList.remove('flipped');
                    page.style.zIndex = rightStackSize - (pageNum - currentPage);
                }
            });
            document.getElementById('pageIndicator').textContent = \`Page \${currentPage} of \${totalPages}\`;
            document.getElementById('prevBtn').disabled = currentPage === 1;
            document.getElementById('nextBtn').disabled = currentPage >= totalPages;
        }

        function nextPage() {
            if (currentPage < totalPages) { currentPage++; updatePageDisplay(); }
        }
        function prevPage() {
            if (currentPage > 1) { currentPage--; updatePageDisplay(); }
        }

        function setupEventListeners() {
            document.getElementById('prevBtn').addEventListener('click', prevPage);
            document.getElementById('nextBtn').addEventListener('click', nextPage);
            let startX = 0;
            const bookContainer = document.getElementById('bookContainer');
            bookContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
            bookContainer.addEventListener('touchend', (e) => {
                if (!startX) return;
                const diffX = startX - e.changedTouches[0].clientX;
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) nextPage();
                    else prevPage();
                }
                startX = 0;
            }, { passive: true });
        }

        document.addEventListener('DOMContentLoaded', initializeBook);
    </script>
</body>
</html>
  `;

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      )}
      {pdfBase64 && (
        <WebView
          ref={webViewRef}
          source={{ html: getHtmlContent(pdfBase64) }}
          style={styles.webView}
          onLoadEnd={handleLoadEnd}
          onError={(e) => Alert.alert("WebView Error", `Failed to load: ${e.nativeEvent.description}`)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          androidLayerType="hardware"
        />
      )}
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
    ...StyleSheet.absoluteFillObject,
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

export default PdfFlipper;
