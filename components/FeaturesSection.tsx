import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, BarChart3, Users, Clock, Star } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Analysis",
    description: "Get car price analysis in seconds with our AI-powered engine",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Market Accurate",
    description: "Based on real Hong Kong market data and current trends",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Detailed Insights",
    description: "Comprehensive analysis with market comparison and recommendations",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Trusted by Thousands",
    description: "Join 10,000+ satisfied users who trust our car valuations",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Always Updated",
    description: "Real-time market data ensures accurate and current pricing",
    color: "from-indigo-400 to-purple-500"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Expert Backed",
    description: "Algorithm developed with automotive industry professionals",
    color: "from-pink-400 to-rose-500"
  }
]

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Why Choose AutoVal?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the most advanced car valuation platform in Hong Kong
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 rounded-2xl blur group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative bg-gray-800 bg-opacity-80 rounded-2xl p-8 border border-gray-600 hover:bg-opacity-90 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
