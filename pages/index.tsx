import React, { useState } from 'react'
import { CarData, PriceAnalysis } from '@/types/car'
import { Car, TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, Calendar, Gauge, Fuel, Sparkles, Star, Users, Shield, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FeaturesSection from '@/components/FeaturesSection'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'

const Home: React.FC = () => {
  const [carData, setCarData] = useState<CarData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    color: '',
    owners: 1,
    price: 0,
    fuelType: '',
    transmission: '',
    seats: 5,
    engineCC: 0
  })
  
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof CarData, value: any) => {
    setCarData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear previous analysis when form is modified
    if (analysis) {
      setAnalysis(null)
    }
  }

  const analyzeCar = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to analyze car')
      }
      
      const analysisData = await response.json()
      setAnalysis(analysisData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return carData.make && carData.model && carData.year && carData.price > 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getPriceRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'bg-gradient-to-r from-green-500 to-green-600'
      case 'good':
        return 'bg-gradient-to-r from-blue-500 to-blue-600'
      case 'fair':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      case 'high':
        return 'bg-gradient-to-r from-orange-500 to-orange-600'
      case 'very_high':
        return 'bg-gradient-to-r from-red-500 to-red-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getPriceRatingIcon = (rating: string) => {
    switch (rating) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-6 h-6" />
      case 'fair':
        return <AlertCircle className="w-6 h-6" />
      case 'high':
      case 'very_high':
        return <TrendingUp className="w-6 h-6" />
      default:
        return <AlertCircle className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-20 animate-pulse filter blur-xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full opacity-20 animate-pulse filter blur-xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full opacity-20 animate-pulse filter blur-xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur opacity-75"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
                <Car className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
          <motion.h1 
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AutoVal
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get instant, AI-powered car price analysis based on real Hong Kong market data
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Market Accurate
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Instant Results
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Features Section */}
        <FeaturesSection />
        
        {/* Stats Section */}
        <StatsSection />
        
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Car Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-gray-600 hover:bg-opacity-95 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Car Details</h2>
                <div className="ml-auto flex items-center text-sm text-gray-300">
                  <Users className="w-4 h-4 mr-1" />
                  Trusted by 10k+ users
                </div>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Car className="w-4 h-4 mr-2" />
                  Make
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  title="Select car make"
                >
                  <option value="">Select make</option>
                  <option value="Acura">Acura</option>
                  <option value="Alfa Romeo">Alfa Romeo</option>
                  <option value="Aston Martin">Aston Martin</option>
                  <option value="Audi">Audi</option>
                  <option value="Bentley">Bentley</option>
                  <option value="BMW">BMW</option>
                  <option value="Buick">Buick</option>
                  <option value="Cadillac">Cadillac</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Chrysler">Chrysler</option>
                  <option value="Citroën">Citroën</option>
                  <option value="Dodge">Dodge</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Ford">Ford</option>
                  <option value="Genesis">Genesis</option>
                  <option value="GMC">GMC</option>
                  <option value="Honda">Honda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Jaguar">Jaguar</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Kia">Kia</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Lincoln">Lincoln</option>
                  <option value="Maserati">Maserati</option>
                  <option value="Mazda">Mazda</option>
                  <option value="McLaren">McLaren</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="MINI">MINI</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Ram">Ram</option>
                  <option value="Renault">Renault</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Car className="w-4 h-4 mr-2" />
                  Model
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="e.g., Camry, Civic, X3"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Year
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  title="Select year"
                >
                  <option value="">Select year</option>
                  {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Gauge className="w-4 h-4 mr-2" />
                  Mileage (km)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  min="0"
                  placeholder="e.g., 50000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Car className="w-4 h-4 mr-2" />
                  Color
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  title="Select car color"
                >
                  <option value="">Select color</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="silver">Silver</option>
                  <option value="grey">Grey</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Purple</option>
                  <option value="brown">Brown</option>
                  <option value="gold">Gold</option>
                  <option value="bronze">Bronze</option>
                  <option value="maroon">Maroon</option>
                  <option value="navy">Navy</option>
                  <option value="beige">Beige</option>
                  <option value="cream">Cream</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="pearl">Pearl</option>
                  <option value="metallic">Metallic</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Owners
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.owners}
                  onChange={(e) => handleInputChange('owners', parseInt(e.target.value))}
                  title="Select number of previous owners"
                >
                  <option value={1}>1 Owner</option>
                  <option value={2}>2 Owners</option>
                  <option value={3}>3 Owners</option>
                  <option value={4}>4+ Owners</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Fuel className="w-4 h-4 mr-2" />
                  Fuel Type
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  title="Select fuel type"
                >
                  <option value="">Select fuel type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <Car className="w-4 h-4 mr-2" />
                  Transmission
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  title="Select transmission type"
                >
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-200 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Asking Price (HK$)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-gray-600"
                  value={carData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                  min="0"
                  placeholder="e.g., 200000"
                />
              </div>
            </div>
            
            <motion.div 
              className="mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <button
                onClick={analyzeCar}
                disabled={!isFormValid() || loading}
                className={`group w-full py-4 px-6 rounded-2xl font-semibold text-white text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  isFormValid() && !loading
                    ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>Analyzing your car...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 mr-2 group-hover:animate-pulse" />
                    <span>Analyze Price</span>
                    <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
          
          {/* Enhanced Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-red-900 bg-opacity-80 border border-red-600 rounded-2xl p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-500 rounded-full mr-4">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-red-200 font-medium">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced Analysis Results */}
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
                {/* Enhanced Price Rating */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-gray-600 hover:bg-opacity-95 transition-all duration-300">
                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <TrendingUp className="w-8 h-8 mr-3 text-blue-400" />
                      Price Analysis
                    </h3>
                
                <motion.div 
                  className={`text-center py-8 px-8 rounded-2xl text-white font-bold text-2xl mb-8 ${getPriceRatingColor(analysis.priceRating)} shadow-2xl relative overflow-hidden`}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative flex items-center justify-center">
                    {getPriceRatingIcon(analysis.priceRating)}
                    <span className="ml-3">
                      {analysis.priceRating?.charAt(0).toUpperCase() + analysis.priceRating?.slice(1).replace('_', ' ') || 'Unknown'} Price
                    </span>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { value: formatPrice(carData.price), label: 'Your Price', color: 'text-gray-200', bg: 'bg-gray-700 hover:bg-gray-600 border-gray-600' },
                    { value: formatPrice(analysis.marketPrice.average), label: 'Market Average', color: 'text-blue-400', bg: 'bg-blue-900 hover:bg-blue-800 border-blue-700' },
                    { value: formatPrice(Math.abs(analysis.priceDifference)), label: 'Difference', color: 'text-purple-400', bg: 'bg-purple-900 hover:bg-purple-800 border-purple-700' },
                    { value: `${Math.abs(analysis.percentageDifference).toFixed(1)}%`, label: 'Percentage', color: 'text-green-400', bg: 'bg-green-900 hover:bg-green-800 border-green-700' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-6 rounded-xl border transition-all duration-300 ${item.bg}`}
                    >
                      <div className={`text-3xl font-bold mb-2 ${item.color}`}>{item.value}</div>
                      <div className="text-sm text-gray-300 font-medium">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
              
              {/* Enhanced Market Comparison */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-gray-600 hover:bg-opacity-95 transition-all duration-300">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <TrendingDown className="w-8 h-8 mr-3 text-purple-400" />
                    Market Comparison
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { value: analysis.marketComparison.lowerPriced, label: 'Cars Priced Lower', desc: 'Better deal available', color: 'text-green-400', bg: 'bg-green-900 hover:bg-green-800 border-green-700' },
                      { value: analysis.marketComparison.similarPriced, label: 'Similarly Priced', desc: 'Market average', color: 'text-yellow-400', bg: 'bg-yellow-900 hover:bg-yellow-800 border-yellow-700' },
                      { value: analysis.marketComparison.higherPriced, label: 'Cars Priced Higher', desc: 'Premium pricing', color: 'text-red-400', bg: 'bg-red-900 hover:bg-red-800 border-red-700' }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`text-center p-6 rounded-xl border hover:shadow-xl transition-all duration-300 ${item.bg}`}
                      >
                        <div className={`text-4xl font-bold mb-3 ${item.color}`}>{item.value}</div>
                        <div className="text-sm text-gray-200 font-semibold">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-gray-600 hover:bg-opacity-95 transition-all duration-300">
                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <CheckCircle className="w-8 h-8 mr-3 text-green-400" />
                      Recommendations
                    </h3>
                    <div className="space-y-4">
                      {analysis.recommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-start space-x-4 p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-200 leading-relaxed text-lg">{recommendation}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home
