export interface CarData {
  make: string
  model: string
  year: number
  mileage: number
  color: string
  owners: number
  price: number
  fuelType: string
  transmission: string
  seats: number
  engineCC: number
}

export interface MarketCar {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  color: string
  owners: number
  price: number
  fuelType: string
  transmission: string
  seats: number
  engineCC: number
  dateListed: string
}

export interface PriceAnalysis {
  userCar: CarData
  marketPrice: {
    average: number
    median: number
    min: number
    max: number
    count: number
  }
  priceRating: 'excellent' | 'good' | 'fair' | 'high' | 'very_high'
  priceDifference: number
  percentageDifference: number
  marketComparison: {
    lowerPriced: number
    higherPriced: number
    similarPriced: number
  }
  similarCars: MarketCar[]
  factors: {
    makeModel: number
    year: number
    mileage: number
    owners: number
    color: number
    fuelType: number
    transmission: number
    overall: number
  }
  recommendations: string[]
  marketTrends: {
    priceRange: {
      min: number
      max: number
      count: number
    }[]
    popularColors: {
      color: string
      count: number
      averagePrice: number
    }[]
    mileageImpact: {
      range: string
      averagePrice: number
      count: number
    }[]
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface CarSearchFilters {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  mileageMax?: number
  fuelType?: string
  transmission?: string
  color?: string
  maxOwners?: number
}
