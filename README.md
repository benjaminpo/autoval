# AutoVal - Car Price Analyzer

A comprehensive car price analysis application that helps users make informed decisions when buying cars by comparing prices against market data from 28car.com.

## Features

🚗 **Smart Price Analysis**: Compare your car's price against similar vehicles in the market
📊 **Market Insights**: Visualize price trends, popular colors, and mileage impact
🔍 **Detailed Comparison**: Find similar cars with matching make, model, year, and specs
📈 **Price Rating System**: Get instant feedback on whether a price is excellent, good, fair, or high
💡 **Recommendations**: Receive personalized advice based on market analysis
📱 **Mobile-Friendly**: Built with Ionic for responsive design

## Technology Stack

### Frontend
- **React** - UI framework
- **Next.js** - React framework with routing
- **Ionic** - Mobile-first UI components
- **TypeScript** - Type-safe JavaScript
- **Recharts** - Data visualization

### Backend
- **Python** - Backend language
- **Flask** - Web framework
- **BeautifulSoup** - Web scraping
- **Pandas** - Data analysis
- **NumPy** - Numerical computing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autoval
   ```

2. **Run the startup script**
   ```bash
   ./start.sh
   ```
   
   This script will:
   - Install all dependencies
   - Set up Python virtual environment
   - Start both backend and frontend servers

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup

If you prefer to set up manually:

1. **Install frontend dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up Python backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Start the backend server**
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

4. **Start the frontend server**
   ```bash
   npm run dev
   ```

## Usage

### Analyzing a Car Price

1. **Enter Car Details**
   - Make (e.g., Toyota, Honda, BMW)
   - Model (e.g., Camry, Civic, X3)
   - Year
   - Mileage
   - Number of owners
   - Color
   - Fuel type
   - Transmission type
   - Asking price

2. **Get Analysis**
   - Click "Analyze Price" button
   - View detailed price comparison
   - Check market statistics
   - Review recommendations

3. **Understand Results**
   - **Price Rating**: Excellent, Good, Fair, High, or Very High
   - **Market Comparison**: How many similar cars are priced higher/lower
   - **Price Factors**: Impact of different features on price
   - **Market Trends**: Visual charts showing price distribution

### API Endpoints

- `POST /api/analyze-car` - Analyze a car's price
- `GET /api/market-data` - Get current market data
- `POST /api/refresh-data` - Force refresh market data
- `GET /api/health` - Health check

## Configuration

### Backend Configuration
The backend automatically scrapes data from 28car.com and generates mock data for testing. You can modify the scraping behavior in `backend/app.py`.

### Frontend Configuration
Frontend settings can be modified in `next.config.js` for API routing and other configurations.

## Data Sources

- **28car.com**: Hong Kong car marketplace for real market data
- **Mock Data**: Generated when scraping is not available for testing

## Development

### Project Structure
```
autoval/
├── components/          # React components
│   ├── PriceComparison.tsx
│   └── MarketAnalysis.tsx
├── pages/              # Next.js pages
│   ├── _app.tsx
│   └── index.tsx
├── types/              # TypeScript types
│   └── car.ts
├── styles/             # CSS styles
│   └── globals.css
├── backend/            # Python backend
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
├── package.json
├── next.config.js
├── tsconfig.json
└── start.sh
```

### Adding New Features

1. **Frontend Components**: Add new React components in the `components/` directory
2. **API Endpoints**: Add new Flask routes in `backend/app.py`
3. **Types**: Update TypeScript types in `types/car.ts`
4. **Styling**: Add CSS styles in `styles/globals.css`

### Testing

Currently, the application uses mock data for testing. To test with real data:

1. Ensure stable internet connection
2. The backend will attempt to scrape from 28car.com
3. If scraping fails, it falls back to mock data

## Deployment

### Docker Deployment (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Set up Python environment on server
3. Configure reverse proxy (nginx)
4. Set up process manager (PM2, systemd)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests if applicable
5. Submit pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## Roadmap

- [ ] Add more car marketplaces
- [ ] Implement user accounts
- [ ] Add price alerts
- [ ] Mobile app version
- [ ] Advanced filtering options
- [ ] Historical price tracking
- [ ] Car value predictions

---

Built with ❤️ for car enthusiasts and smart buyers.
