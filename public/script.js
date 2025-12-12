// API Configuration
const API_KEY = 'd9qf7sJUo8Fo4AHNFdFGRDmH'; // Replace with your Remove.bg or ClipDrop API key
const API_URL = 'https://api.remove.bg/v1.0/removebg'; // Using Remove.bg API

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
uploadBtn.addEventListener('click', () => fileInput.click());
demoBtn.addEventListener('click', loadDemoImage);

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
        
        // Hide CTA buttons when preview is shown
        const ctaButtons = document.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.style.display = 'none';
        }

        // Process image with API
        removeBackground(file);
    };
    reader.readAsDataURL(file);
}

// Background Removal API Call
async function removeBackground(file) {
    try {
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.status} ${response.statusText}`);
        }

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
        showError(`Failed to remove background: ${error.message}. Please check your API key and try again.`);
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
    
    // Show CTA buttons again
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
        ctaButtons.style.display = 'flex';
    }
    
    // Clean up blob URLs
    if (downloadBtn.dataset.blobUrl) {
        URL.revokeObjectURL(downloadBtn.dataset.blobUrl);
        delete downloadBtn.dataset.blobUrl;
    }
}

// Demo Image Handler
async function loadDemoImage() {
    try {
        // Create a simple demo image (a colored rectangle with text)
        // In a real scenario, you might want to use an actual sample image URL
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Draw a simple demo image
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DEMO', 200, 200);
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'demo-image.png', { type: 'image/png' });
                processFile(file);
            }
        }, 'image/png');
        
    } catch (error) {
        console.error('Error loading demo image:', error);
        showError('Failed to load demo image. Please try uploading your own image.');
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

