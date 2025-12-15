// API Configuration
const API_URL = '/api/remove-bg'; // Backend API endpoint

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
const uploadBtn = document.getElementById('uploadBtn');
const demoBtn = document.getElementById('demoBtn');

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
resetBtn.addEventListener('click', resetUpload);
downloadBtn.addEventListener('click', downloadImage);
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => fileInput.click());
}
if (demoBtn) {
    demoBtn.addEventListener('click', loadDemoImage);
}

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
        // Convert file to base64 for sending to backend
        const reader = new FileReader();
        const base64Image = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Send image to backend API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image,
                filename: file.name,
                imageType: file.type
            })
        });

        if (!response.ok) {
            // Try to parse error message
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }

        // Get the processed image as a blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Display result
        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
        loadingState.style.display = 'none';
        downloadBtn.style.display = 'inline-block';

        // Store blob for download
        downloadBtn.dataset.blobUrl = imageUrl;
        downloadBtn.dataset.filename = file.name.replace(/\.[^/.]+$/, '') + '_no_bg.png';

    } catch (error) {
        console.error('Error removing background:', error);
        showError(`Failed to remove background: ${error.message}`);
        loadingState.style.display = 'none';
    }
}

// Download Handler
function downloadImage() {
    const blobUrl = downloadBtn.dataset.blobUrl;
    const filename = downloadBtn.dataset.filename;

    if (!blobUrl) return;

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Reset Handler
function resetUpload() {
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
    fileInput.value = '';
    originalImage.src = '';
    resultImage.src = '';
    hideError();
    
    // Clean up blob URLs
    if (downloadBtn.dataset.blobUrl) {
        URL.revokeObjectURL(downloadBtn.dataset.blobUrl);
        delete downloadBtn.dataset.blobUrl;
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

// Alternative API Implementation (ClipDrop)
// Uncomment and modify if using ClipDrop instead of Remove.bg
/*
async function removeBackgroundClipDrop(file) {
    try {
        const formData = new FormData();
        formData.append('image_file', file);

        const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        resultImage.src = imageUrl;
        resultImage.style.display = 'block';
        loadingState.style.display = 'none';
        downloadBtn.style.display = 'inline-block';

        downloadBtn.dataset.blobUrl = imageUrl;
        downloadBtn.dataset.filename = file.name.replace(/\.[^/.]+$/, '') + '_no_bg.png';

    } catch (error) {
        console.error('Error removing background:', error);
        showError(`Failed to remove background: ${error.message}`);
        loadingState.style.display = 'none';
    }
}
*/

// Demo Image Handler
async function loadDemoImage() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DEMO', canvas.width / 2, canvas.height / 2);

        // Convert to blob and wrap as File
        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], 'demo-image.png', { type: 'image/png' });
            processFile(file);
        }, 'image/png');
    } catch (error) {
        console.error('Error loading demo image:', error);
        showError('Failed to load demo image. Please try again.');
    }
}

