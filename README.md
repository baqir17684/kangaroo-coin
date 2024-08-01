# Kangaroo-Coin Project

This repository contains three main components: two backend services (IPFS Loader and Company Info Crawler) and a frontend application.

## Project Structure

- `frontend/`: React-based frontend application
- `ipfs upload/`: IPFS Loader service
- `company-info/`: Company Information Crawling service

## Setup and Running

### Frontend

To run the frontend application:

1. Navigate to the frontend directory:
cd frontend
2. Install dependencies:
npm install
3. Start the development server:
npm start

### IPFS Loader

To use the IPFS Loader service:

1. Navigate to the IPFS upload directory:
cd ipfs\ upload
2. Install dependencies:
npm install
3. Start the service:
npm start

### Company Info Crawler

To use the Company Information Crawling service:

1. Navigate to the company-info directory:
cd company-info
2. Install required Python libraries:
pip install Flask Flask-CORS wikipedia-api beautifulsoup4 requests
3. Run the Python application:
python3 app.py

## Requirements

- Node.js and npm for the frontend and IPFS Loader
- Python 3 for the Company Info Crawler
- Additional Python libraries: Flask, Flask-CORS, wikipedia-api, beautifulsoup4, requests

## Getting Started

1. Clone this repository:
git clone [repository-url]
2. Follow the setup instructions for each component as described above.
