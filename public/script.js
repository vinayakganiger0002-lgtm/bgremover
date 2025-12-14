// API Configuration
const BACKEND_API_URL = '/api/remove-bg';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const loadingState = document.getElementById('loadingState');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
resetBtn.addEventListener('click', resetUpload);
downloadBtn.addEventListener('click', downloadImage);

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// File Processing
function processFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file.');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB.');
        return;
    }

    // Hide error message
    hideError();

    // Display original image
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        uploadSection.style.display = 'none';
        previewSection.style.display = 'block';
        loadingState.style.display = 'block';
        resultImage.style.display = 'none';
        downloadBtn.style.display = 'none';

        // Process image with API
        removeBackground(file);
    };
    reader.readAsDataURL(file);
}

// Background Removal API Call
async function removeBackground(file) {
    try {
        // Convert file to base64
        const imageData = await fileToBase64(file);

        // Send POST request to backend endpoint
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `API Error: ${response.status} ${response.statusText}`);
        }

        // Parse JSON response
        const data = await response.json();
        
        // Handle response - expect processed image as base64 or URL
        let imageUrl;
        if (data.image) {
            // If response contains base64 image
            imageUrl = data.image.startsWith('data:') ? data.image : `data:image/png;base64,${data.image}`;
        } else if (data.url) {
            // If response contains image URL
            imageUrl = data.url;
        } else {
            throw new Error('Invalid response format from server');
        }

        // Display result
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
        loadingState.style.display = 'none';
        downloadBtn.style.display = 'inline-block';

        // Store image data for download
        downloadBtn.dataset.imageUrl = imageUrl;
        downloadBtn.dataset.filename = file.name.replace(/\.[^/.]+$/, '') + '_no_bg.png';

    } catch (error) {
        console.error('Error removing background:', error);
        showError(`Failed to remove background: ${error.message}. Please try again.`);
        loadingState.style.display = 'none';
    }
}

// Convert file to base64 string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove data URL prefix if present, or keep it
            const base64 = reader.result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Download Handler
function downloadImage() {
    const imageUrl = downloadBtn.dataset.imageUrl;
    const filename = downloadBtn.dataset.filename;

    if (!imageUrl) return;

    // Convert base64 to blob for download
    fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
            showError('Failed to download image. Please try again.');
        });
}

// Reset Handler
function resetUpload() {
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
    fileInput.value = '';
    originalImage.src = '';
    resultImage.src = '';
    hideError();
    
    // Clean up image data
    if (downloadBtn.dataset.imageUrl) {
        delete downloadBtn.dataset.imageUrl;
    }
}

// Error Handling
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}


