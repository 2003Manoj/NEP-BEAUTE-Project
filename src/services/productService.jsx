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
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Kumkumadi Face Oil",
      description: "Ayurvedic face oil for glowing skin with saffron and other herbs.",
      image:
        "https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Aloe Vera Gel",
      description: "Pure aloe vera gel for soothing and hydrating skin.",
      image:
        "https://images.unsplash.com/photo-1626397559626-78ab0b421d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Rose Water Toner",
      description: "Natural rose water toner for refreshing and balancing skin.",
      image:
        "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sandalwood Face Pack",
      description: "Traditional face pack with sandalwood for clear skin.",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Turmeric Face Cream",
      description: "Brightening face cream with turmeric and other natural ingredients.",
      image:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Neem Face Wash",
      description: "Anti-acne face wash with neem extract for problematic skin.",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Vitamin C Serum",
      description: "Brightening serum with vitamin C for radiant skin.",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ]

  // Makeup products with specific images
  const makeupProducts = [
    {
      name: "Kajal",
      description: "Long-lasting kajal for beautiful eyes.",
      image:
        "https://images.unsplash.com/photo-1631214524020-3c8a59e8c73d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Liquid Lipstick",
      description: "Matte liquid lipstick in various shades.",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "BB Cream",
      description: "Light coverage BB cream for natural looking skin.",
      image:
        "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Compact Powder",
      description: "Oil control compact powder for a matte finish.",
      image:
        "https://images.unsplash.com/photo-1599733589046-9b8308b5b50a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Mascara",
      description: "Volumizing mascara for dramatic lashes.",
      image:
        "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Eyeshadow Palette",
      description: "Versatile eyeshadow palette with multiple shades.",
      image:
        "https://images.unsplash.com/photo-1596704017254-9a931f0c78e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Blush",
      description: "Natural looking blush for a healthy glow.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Foundation",
      description: "Long-wearing foundation for full coverage.",
      image:
        "https://images.unsplash.com/photo-1590156562745-5c67f8c3a1fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ]

  // Haircare products with specific images
  const haircareProducts = [
    {
      name: "Hair Oil",
      description: "Nourishing hair oil with blend of natural oils.",
      image:
        "https://images.unsplash.com/photo-1585232351009-aa87416fca90?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Herbal Shampoo",
      description: "Gentle herbal shampoo for all hair types.",
      image:
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Hair Mask",
      description: "Deep conditioning hair mask for damaged hair.",
      image:
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Leave-in Conditioner",
      description: "Lightweight leave-in conditioner for smooth hair.",
      image:
        "https://images.unsplash.com/photo-1626120032630-b51c96a544de?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Hair Serum",
      description: "Anti-frizz hair serum for smooth and shiny hair.",
      image:
        "https://images.unsplash.com/photo-1597854408118-912c5c3b8943?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Scalp Scrub",
      description: "Exfoliating scalp scrub for healthy scalp.",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dry Shampoo",
      description: "Refreshing dry shampoo for on-the-go.",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Hair Growth Tonic",
      description: "Stimulating tonic for promoting hair growth.",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ]

  // Fragrance products with specific images
  const fragranceProducts = [
    {
      name: "Rose Perfume",
      description: "Elegant rose perfume for a floral scent.",
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sandalwood Cologne",
      description: "Classic sandalwood cologne for a woody scent.",
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Jasmine Body Mist",
      description: "Light jasmine body mist for everyday use.",
      image:
        "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Musk Perfume",
      description: "Long-lasting musk perfume for a bold statement.",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Citrus Eau de Toilette",
      description: "Refreshing citrus eau de toilette for a zesty scent.",
      image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Lavender Room Spray",
      description: "Calming lavender room spray for relaxation.",
      image:
        "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Vanilla Perfume",
      description: "Sweet vanilla perfume for a warm scent.",
      image:
        "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Amber Attar",
      description: "Traditional amber attar for a rich, exotic scent.",
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
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
