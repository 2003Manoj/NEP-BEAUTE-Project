// Mock product data service
// In a real application, this would fetch data from an API

// Helper function to generate random products
const generateProducts = () => {
  const categories = ["skincare", "makeup", "haircare", "fragrance"]
  const brands = ["Himalaya", "Dabur", "Patanjali", "Lotus", "Lakme", "Maybelline", "Biotique", "Forest Essentials"]

  const products = []

  // Skincare products with specific images
  const skincareProducts = [
    {
      name: "Himalayan Face Wash",
      description: "Natural face wash with Himalayan herbs for deep cleansing.",
      image: "https://images.pexels.com/photos/3737600/pexels-photo-3737600.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Kumkumadi Face Oil",
      description: "Ayurvedic face oil for glowing skin with saffron and other herbs.",
      image: "https://images.pexels.com/photos/5069438/pexels-photo-5069438.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Aloe Vera Gel",
      description: "Pure aloe vera gel for soothing and hydrating skin.",
      image: "https://images.pexels.com/photos/7290697/pexels-photo-7290697.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Rose Water Toner",
      description: "Natural rose water toner for refreshing and balancing skin.",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Sandalwood Face Pack",
      description: "Traditional face pack with sandalwood for clear skin.",
      image: "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Turmeric Face Cream",
      description: "Brightening face cream with turmeric and other natural ingredients.",
      image: "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Neem Face Wash",
      description: "Anti-acne face wash with neem extract for problematic skin.",
      image: "https://images.pexels.com/photos/3737591/pexels-photo-3737591.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Vitamin C Serum",
      description: "Brightening serum with vitamin C for radiant skin.",
      image: "https://images.pexels.com/photos/6476071/pexels-photo-6476071.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  // Makeup products with specific images
  const makeupProducts = [
    {
      name: "Kajal",
      description: "Long-lasting kajal for beautiful eyes.",
      image: "https://images.pexels.com/photos/5702341/pexels-photo-5702341.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Liquid Lipstick",
      description: "Matte liquid lipstick in various shades.",
      image: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "BB Cream",
      description: "Light coverage BB cream for natural looking skin.",
      image: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Compact Powder",
      description: "Oil control compact powder for a matte finish.",
      image: "https://images.pexels.com/photos/2537930/pexels-photo-2537930.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Mascara",
      description: "Volumizing mascara for dramatic lashes.",
      image: "https://images.pexels.com/photos/3817855/pexels-photo-3817855.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Eyeshadow Palette",
      description: "Versatile eyeshadow palette with multiple shades.",
      image: "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Blush",
      description: "Natural looking blush for a healthy glow.",
      image: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Foundation",
      description: "Long-wearing foundation for full coverage.",
      image: "https://images.pexels.com/photos/2688991/pexels-photo-2688991.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  // Haircare products with specific images
  const haircareProducts = [
    {
      name: "Hair Oil",
      description: "Nourishing hair oil with blend of natural oils.",
      image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Herbal Shampoo",
      description: "Gentle herbal shampoo for all hair types.",
      image: "https://images.pexels.com/photos/3735652/pexels-photo-3735652.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Hair Mask",
      description: "Deep conditioning hair mask for damaged hair.",
      image: "https://images.pexels.com/photos/3998022/pexels-photo-3998022.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Leave-in Conditioner",
      description: "Lightweight leave-in conditioner for smooth hair.",
      image: "https://images.pexels.com/photos/3737579/pexels-photo-3737579.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Hair Serum",
      description: "Anti-frizz hair serum for smooth and shiny hair.",
      image: "https://images.pexels.com/photos/3785170/pexels-photo-3785170.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Scalp Scrub",
      description: "Exfoliating scalp scrub for healthy scalp.",
      image: "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Dry Shampoo",
      description: "Refreshing dry shampoo for on-the-go.",
      image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Hair Growth Tonic",
      description: "Stimulating tonic for promoting hair growth.",
      image: "https://images.pexels.com/photos/4210342/pexels-photo-4210342.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  // Fragrance products with specific images
  const fragranceProducts = [
    {
      name: "Rose Perfume",
      description: "Elegant rose perfume for a floral scent.",
      image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Sandalwood Cologne",
      description: "Classic sandalwood cologne for a woody scent.",
      image: "https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Jasmine Body Mist",
      description: "Light jasmine body mist for everyday use.",
      image: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Musk Perfume",
      description: "Long-lasting musk perfume for a bold statement.",
      image: "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Citrus Eau de Toilette",
      description: "Refreshing citrus eau de toilette for a zesty scent.",
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Lavender Room Spray",
      description: "Calming lavender room spray for relaxation.",
      image: "https://images.pexels.com/photos/4210653/pexels-photo-4210653.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Vanilla Perfume",
      description: "Sweet vanilla perfume for a warm scent.",
      image: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Amber Attar",
      description: "Traditional amber attar for a rich, exotic scent.",
      image: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  const allProductsByCategory = {
    skincare: skincareProducts,
    makeup: makeupProducts,
    haircare: haircareProducts,
    fragrance: fragranceProducts,
  }

  // Generate products for each category
  categories.forEach((category) => {
    const categoryProducts = allProductsByCategory[category]

    categoryProducts.forEach((product, index) => {
      const price = Math.floor(Math.random() * 1500) + 500 // Random price between 500 and 2000
      const hasDiscount = Math.random() > 0.5
      const originalPrice = hasDiscount ? price + Math.floor(price * (Math.random() * 0.4 + 0.1)) : null
      const rating = (Math.random() * 2 + 3).toFixed(1) // Random rating between 3 and 5
      const reviewCount = Math.floor(Math.random() * 100) + 5 // Random review count
      const isNew = Math.random() > 0.7
      const isFeatured = Math.random() > 0.7
      const bestSeller = Math.random() > 0.7

      products.push({
        id: `${category}-${index + 1}`,
        name: product.name,
        description: product.description,
        price,
        originalPrice,
        category,
        brand: brands[Math.floor(Math.random() * brands.length)],
        rating: Number.parseFloat(rating),
        reviewCount,
        isNew,
        featured: isFeatured,
        bestSeller,
        image: product.image, // Use the specific image for this product
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
      })
    })
  })

  return products
}

// Cache the generated products
let cachedProducts = null

export const getProducts = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!cachedProducts) {
    cachedProducts = generateProducts()
  }

  return cachedProducts
}

export const getProductById = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!cachedProducts) {
    cachedProducts = generateProducts()
  }

  const product = cachedProducts.find((p) => p.id === id)

  if (!product) {
    throw new Error("Product not found")
  }

  return product
}

export const getRelatedProducts = async (category, currentProductId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!cachedProducts) {
    cachedProducts = generateProducts()
  }

  return cachedProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .sort(() => 0.5 - Math.random()) // Shuffle array
    .slice(0, 4) // Get first 4 items
}
