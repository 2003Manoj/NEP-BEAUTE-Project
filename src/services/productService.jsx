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
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/06eadd07-0321-490f-ad8a-1a11434ace80.png",
    },
    {
      name: "Kumkumadi Face Oil",
      description: "Ayurvedic face oil for glowing skin with saffron and other herbs.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8a18ff3d-8f0e-4348-9097-2e6667b2efe9.png",
    },
    {
      name: "Aloe Vera Gel",
      description: "Pure aloe vera gel for soothing and hydrating skin.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3dfe6464-1d34-45b5-8274-fc1bec2671f4.png",
    },
    {
      name: "Rose Water Toner",
      description: "Natural rose water toner for refreshing and balancing skin.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/daf63fcf-10f7-4b40-a6a2-fe3a3a1ae0ff.png",
    },
    {
      name: "Sandalwood Face Pack",
      description: "Traditional face pack with sandalwood for clear skin.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ffc09cc1-c0e0-4288-b8eb-2c5bb65cab6a.png",
    },
    {
      name: "Turmeric Face Cream",
      description: "Brightening face cream with turmeric and other natural ingredients.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bf3279be-1d02-4078-9e9f-418ea57d53ce.png",
    },
    {
      name: "Neem Face Wash",
      description: "Anti-acne face wash with neem extract for problematic skin.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ac748ef7-5e44-435d-8d8f-c2e0ad294ef3.png",
    },
    {
      name: "Vitamin C Serum",
      description: "Brightening serum with vitamin C for radiant skin.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f99143c7-d07a-4ef3-85b1-8f0772af3e5d.png",
    },
  ]

  // Makeup products with specific images
  const makeupProducts = [
    {
      name: "Kajal",
      description: "Long-lasting kajal for beautiful eyes.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/abc4c23e-2407-40d9-bfc2-bc85ac1f5c22.png",
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
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c4af976d-97ca-489e-8952-6b7241d76617.png",
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
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/199e4aa8-ac7c-4384-b8ae-58be84ccf94b.png",
    },
    {
      name: "Herbal Shampoo",
      description: "Gentle herbal shampoo for all hair types.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c214d84f-aa54-41e5-83eb-b667e2904b47.png",    },
    {
      name: "Hair Mask",
      description: "Deep conditioning hair mask for damaged hair.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/429877be-9e50-4423-a040-d993700f7a61.png",    },
    {
      name: "Leave-in Conditioner",
      description: "Lightweight leave-in conditioner for smooth hair.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9077666c-4379-4ef2-bf65-11adcc6f3687.png",    },
    {
      name: "Hair Serum",
      description: "Anti-frizz hair serum for smooth and shiny hair.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e1d06be4-1120-419e-a3c2-cde76b1bc9d9.png",    },
    {
      name: "Scalp Scrub",
      description: "Exfoliating scalp scrub for healthy scalp.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0f141e44-edd9-4e56-9eb3-923def54f3b1.png",    },
    {
      name: "Dry Shampoo",
      description: "Refreshing dry shampoo for on-the-go.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/61c58294-6fc4-4ee6-83f7-4c986382285d.png",    },
    {
      name: "Hair Growth Tonic",
      description: "Stimulating tonic for promoting hair growth.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4f0c2919-73a3-4999-a4ac-02e321fd2436.png",    },
  ]

  // Fragrance products with specific images
  const fragranceProducts = [
    {
      name: "Rose Perfume",
      description: "Elegant rose perfume for a floral scent.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fe4e85cd-3c30-4fef-8f5c-16d053e80456.png",    },
    {
      name: "Sandalwood Cologne",
      description: "Classic sandalwood cologne for a woody scent.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d86f3279-6982-47c3-8c36-4ea5f06a892f.png",    },
    {
      name: "Jasmine Body Mist",
      description: "Light jasmine body mist for everyday use.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/23eac472-9957-45f0-b4ff-dcd6dda55aa6.png",    },
    {
      name: "Musk Perfume",
      description: "Long-lasting musk perfume for a bold statement.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ef99effe-b454-4484-9c6f-f60f0f277148.png",    },
    {
      name: "Citrus Eau de Toilette",
      description: "Refreshing citrus eau de toilette for a zesty scent.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ee5c4bfc-0c4f-45b0-b1bd-6eec4338b05a.png",    },
    {
      name: "Room Spray",
      description: "Calming lavender room spray for relaxation.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/75bcf2ec-dd58-4626-ad18-3d039b7880a9.png",    },
    {
      name: "Vanilla Perfume",
      description: "Sweet vanilla perfume for a warm scent.",
      image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/348db076-e959-4b13-b0d1-155d43637c2b.png",    },
    {
      name: "Amber Attar",
      description: "Traditional amber attar for a rich, exotic scent.",
      image: "https://imgs.search.brave.com/baezn-fFXwLMUE_rEF2383cL5QrlmK2LUrNHC505lyo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90YXJp/ZmVhdHRhci5jb20v/Y2RuL3Nob3AvZmls/ZXMvd2hpdGUtYW1i/ZXItNTI4Nzc4LnBu/Zz92PTE3MzQwNjEx/OTEmd2lkdGg9MjA0/OA",    },
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
