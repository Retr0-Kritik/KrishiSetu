// Mock Clustering Engine for Krishi Setu
// Groups shipments by location name for consistent pooling

// Main clustering function - groups by location NAME for consistency
export function clusterShipments(pendingShipments) {
  if (!pendingShipments || pendingShipments.length === 0) {
    return [];
  }

  // Group shipments by location name first
  const locationGroups = {};
  
  pendingShipments.forEach(shipment => {
    const locationName = shipment.location.name;
    if (!locationGroups[locationName]) {
      locationGroups[locationName] = {
        shipments: [],
        farmers: new Set(), // Track unique farmers
        lat: shipment.location.lat,
        lon: shipment.location.lon
      };
    }
    locationGroups[locationName].shipments.push(shipment);
    locationGroups[locationName].farmers.add(shipment.farmerName);
  });

  // Convert to cluster format
  const clusters = Object.entries(locationGroups).map(([locationName, group]) => {
    const totalWeight = group.shipments.reduce((sum, s) => sum + s.weight, 0);
    const farmerCount = group.farmers.size; // Unique farmers only
    
    return {
      id: `cluster-${locationName.toLowerCase().replace(/\s+/g, '-')}`,
      centroid: {
        lat: group.lat,
        lon: group.lon,
        name: locationName
      },
      shipments: group.shipments,
      totalWeight,
      farmerCount,
      // Calculate estimated savings (mock: ₹2 per kg pooled with others)
      estimatedSavings: farmerCount > 1 
        ? Math.round(totalWeight * 2 * (1 - 1/farmerCount))
        : 0
    };
  });

  return clusters;
}

// Mock data generator for West Bengal locations
export function generateMockShipments(count = 15) {
  const locations = [
    { name: "bardhaman", lat: 23.2324, lon: 87.8615 },
    { name: "durgapur", lat: 23.5204, lon: 87.3119 },
    { name: "asansol", lat: 23.6850, lon: 86.9537 },
    { name: "siliguri", lat: 26.7271, lon: 88.6393 },
    { name: "howrah", lat: 22.5958, lon: 88.2636 },
    { name: "kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "malda", lat: 25.0108, lon: 88.1411 },
    { name: "murshidabad", lat: 24.1745, lon: 88.2749 },
    { name: "nadia", lat: 23.4710, lon: 88.5565 },
    { name: "hooghly", lat: 22.9086, lon: 88.3967 },
  ];

  const crops = ["rice", "potato", "jute", "wheat", "vegetables", "mustard", "tea"];
  
  const farmers = [
    "Ramesh Kumar", "Suresh Das", "Anita Devi", "Bikash Mondal", 
    "Priya Ghosh", "Ratan Singh", "Meera Rani", "Arun Biswas",
    "Kamala Devi", "Shankar Roy", "Geeta Bose", "Tapan Mukherjee",
    "Lakshmi Dutta", "Mohan Sarkar", "Rekha Pal"
  ];

  return Array.from({ length: count }, (_, i) => {
    const baseLocation = locations[Math.floor(Math.random() * locations.length)];
    // Add small random offset to create nearby but distinct locations
    const offset = () => (Math.random() - 0.5) * 0.15; // ~8km variance
    
    return {
      id: `shipment-${i + 1}`,
      farmerName: farmers[i % farmers.length],
      crop: crops[Math.floor(Math.random() * crops.length)],
      weight: Math.round(50 + Math.random() * 450), // 50-500 kg
      location: {
        name: baseLocation.name,
        lat: baseLocation.lat + offset(),
        lon: baseLocation.lon + offset()
      },
      requestedDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-IN'),
      status: "pending"
    };
  });
}

// Generate mock market prices for West Bengal crops
export function generateMarketPrices() {
  return [
    { crop: "rice", price: 2150, unit: "quintal", change: +2.3, trend: "up" },
    { crop: "potato", price: 1200, unit: "quintal", change: -1.5, trend: "down" },
    { crop: "jute", price: 5200, unit: "quintal", change: +4.1, trend: "up" },
    { crop: "wheat", price: 2450, unit: "quintal", change: +0.8, trend: "up" },
    { crop: "mustard", price: 5800, unit: "quintal", change: -0.3, trend: "down" },
    { crop: "onion", price: 1800, unit: "quintal", change: +5.2, trend: "up" },
    { crop: "tomato", price: 2200, unit: "quintal", change: -2.1, trend: "down" },
    { crop: "tea", price: 28500, unit: "quintal", change: +1.2, trend: "up" },
  ];
}

// Generate mock AI price predictions
export function generatePricePredictions() {
  return [
    { crop: "rice", current: 2150, predictions: generateTrendData(2150, 7, 0.02) },
    { crop: "potato", current: 1200, predictions: generateTrendData(1200, 7, -0.015) },
    { crop: "jute", current: 5200, predictions: generateTrendData(5200, 7, 0.035) },
    { crop: "wheat", current: 2450, predictions: generateTrendData(2450, 7, 0.01) },
  ];
}

function generateTrendData(basePrice, days, dailyChangeRate) {
  const data = [];
  let price = basePrice;
  const baseDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    // Add some noise to the trend
    const noise = (Math.random() - 0.5) * 0.02;
    price = price * (1 + dailyChangeRate + noise);
    
    data.push({
      day: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      price: Math.round(price),
      date: date.toISOString()
    });
  }
  
  return data;
}

// Calculate transport pooling benefits
export function calculatePoolingBenefits(clusters) {
  let totalSavings = 0;
  let totalFarmers = 0;
  let totalWeight = 0;

  clusters.forEach(cluster => {
    totalSavings += cluster.estimatedSavings;
    totalFarmers += cluster.farmerCount;
    totalWeight += cluster.totalWeight;
  });

  return {
    totalSavings,
    totalFarmers,
    totalWeight,
    avgSavingsPerFarmer: totalFarmers > 0 ? Math.round(totalSavings / totalFarmers) : 0,
    activePoolsCount: clusters.filter(c => c.farmerCount > 1).length
  };
}
