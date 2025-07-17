import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Car, Award } from 'lucide-react'

interface Statistic {
  icon: React.ReactNode
  value: string
  label: string
  description: string
  color: string
}

const statistics: Statistic[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "10,000+",
    label: "Happy Users",
    description: "Trust our platform daily",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <Car className="w-8 h-8" />,
    value: "50,000+",
    label: "Cars Analyzed",
    description: "Accurate valuations delivered",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "98%",
    label: "Accuracy Rate",
    description: "Market-leading precision",
    color: "from-green-400 to-green-600"
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: "4.9/5",
    label: "User Rating",
    description: "Exceptional satisfaction",
    color: "from-yellow-400 to-yellow-600"
  }
]

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-400 rounded-full opacity-10 animate-pulse filter blur-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-purple-400 rounded-full opacity-10 animate-pulse filter blur-xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Trusted by the Community
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied users who rely on AutoVal for accurate car valuations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 rounded-2xl blur group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative text-center bg-gray-800 bg-opacity-80 rounded-2xl p-8 border border-gray-600 hover:bg-opacity-90 transition-all duration-300">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-4 text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-400">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
