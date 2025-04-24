// Mock product data service
// In a real application, this would fetch data from an API

// Helper function to generate random products
const generateProducts = () => {
    const categories = ["skincare", "makeup", "haircare", "fragrance"]
    const brands = ["Himalaya", "Dabur", "Patanjali", "Lotus", "Lakme", "Maybelline", "Biotique", "Forest Essentials"]
  
    const products = []
  
    // Skincare products
    const skincareProducts = [
      { name: "Himalayan Face Wash", description: "Natural face wash with Himalayan herbs for deep cleansing." },
      { name: "Kumkumadi Face Oil", description: "Ayurvedic face oil for glowing skin with saffron and other herbs." },
      { name: "Aloe Vera Gel", description: "Pure aloe vera gel for soothing and hydrating skin." },
      { name: "Rose Water Toner", description: "Natural rose water toner for refreshing and balancing skin." },
      { name: "Sandalwood Face Pack", description: "Traditional face pack with sandalwood for clear skin." },
      { name: "Turmeric Face Cream", description: "Brightening face cream with turmeric and other natural ingredients." },
      { name: "Neem Face Wash", description: "Anti-acne face wash with neem extract for problematic skin." },
      { name: "Vitamin C Serum", description: "Brightening serum with vitamin C for radiant skin." },
    ]
  
    // Makeup products
    const makeupProducts = [
      { name: "Kajal", description: "Long-lasting kajal for beautiful eyes." },
      { name: "Liquid Lipstick", description: "Matte liquid lipstick in various shades." },
      { name: "BB Cream", description: "Light coverage BB cream for natural looking skin." },
      { name: "Compact Powder", description: "Oil control compact powder for a matte finish." },
      { name: "Mascara", description: "Volumizing mascara for dramatic lashes." },
      { name: "Eyeshadow Palette", description: "Versatile eyeshadow palette with multiple shades." },
      { name: "Blush", description: "Natural looking blush for a healthy glow." },
      { name: "Foundation", description: "Long-wearing foundation for full coverage." },
    ]
  
    // Haircare products
    const haircareProducts = [
      { name: "Hair Oil", description: "Nourishing hair oil with blend of natural oils." },
      { name: "Herbal Shampoo", description: "Gentle herbal shampoo for all hair types." },
      { name: "Hair Mask", description: "Deep conditioning hair mask for damaged hair." },
      { name: "Leave-in Conditioner", description: "Lightweight leave-in conditioner for smooth hair." },
      { name: "Hair Serum", description: "Anti-frizz hair serum for smooth and shiny hair." },
      { name: "Scalp Scrub", description: "Exfoliating scalp scrub for healthy scalp." },
      { name: "Dry Shampoo", description: "Refreshing dry shampoo for on-the-go." },
      { name: "Hair Growth Tonic", description: "Stimulating tonic for promoting hair growth." },
    ]
  
    // Fragrance products
    const fragranceProducts = [
      { name: "Rose Perfume", description: "Elegant rose perfume for a floral scent." },
      { name: "Sandalwood Cologne", description: "Classic sandalwood cologne for a woody scent." },
      { name: "Jasmine Body Mist", description: "Light jasmine body mist for everyday use." },
      { name: "Musk Perfume", description: "Long-lasting musk perfume for a bold statement." },
      { name: "Citrus Eau de Toilette", description: "Refreshing citrus eau de toilette for a zesty scent." },
      { name: "Lavender Room Spray", description: "Calming lavender room spray for relaxation." },
      { name: "Vanilla Perfume", description: "Sweet vanilla perfume for a warm scent." },
      { name: "Amber Attar", description: "Traditional amber attar for a rich, exotic scent." },
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
          image: `https://source.unsplash.com/random/300x400/?${category},beauty`,
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
  