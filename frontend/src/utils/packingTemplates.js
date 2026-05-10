export const generateSmartPackingList = (title, destination) => {
  const common = ["Passport", "ID Card", "Tickets", "Phone Charger", "Power Bank", "Toiletries", "Water Bottle"];
  const beachKeywords = ["beach", "goa", "bali", "thailand", "maldives", "ocean", "island"];
  const coldKeywords = ["manali", "leh", "ladakh", "kashmir", "snow", "mountain", "winter", "cold", "switzerland"];
  const adventureKeywords = ["trek", "hike", "adventure", "camp", "forest"];

  const text = `${title} ${destination}`.toLowerCase();
  let items = [...common];

  if (beachKeywords.some(kw => text.includes(kw))) {
    items = [...items, "Sunscreen", "Swimwear", "Flip flops", "Sunglasses", "Beach towel", "Hat"];
  }

  if (coldKeywords.some(kw => text.includes(kw))) {
    items = [...items, "Heavy Jacket", "Gloves", "Woolen Cap", "Thermals", "Moisturizer", "Boots"];
  }

  if (adventureKeywords.some(kw => text.includes(kw))) {
    items = [...items, "Trekking Shoes", "First Aid Kit", "Flashlight", "Raincoat", "Energy Bars"];
  }

  // Remove duplicates and return
  return [...new Set(items)];
};

export const packingCategories = {
  Documents: ["Passport", "ID Card", "Tickets", "Visa", "Insurance"],
  Clothing: ["T-Shirts", "Jeans", "Jacket", "Swimwear", "Gloves", "Woolen Cap", "Thermals", "Underwear", "Socks"],
  Electronics: ["Phone Charger", "Power Bank", "Earphones", "Camera", "Adapter"],
  Essentials: ["Sunscreen", "Flip flops", "Sunglasses", "Beach towel", "Hat", "Toiletries", "Water Bottle", "Medicines", "First Aid Kit", "Flashlight"]
};
