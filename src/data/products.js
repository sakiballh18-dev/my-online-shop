const img = (s) => `https://picsum.photos/seed/${s}/800/1000`
export const CATEGORIES = ['Home', 'Carry', 'Light', 'Textiles']
export const PRODUCTS = [
  { id: 'p1', name: 'Tidal Stoneware Vase', category: 'Home', price: 148, stock: 14, image: img('halden-vase'), description: 'Wheel-thrown in small batches and finished in a matte reactive glaze. No two pieces are identical.' },
  { id: 'p2', name: 'Calder Leather Tote', category: 'Carry', price: 420, stock: 6, image: img('halden-tote'), description: 'Vegetable-tanned Italian leather that darkens with age. Hand-stitched, lined in organic cotton.' },
  { id: 'p3', name: 'Ardent Brass Table Lamp', category: 'Light', price: 260, stock: 9, image: img('halden-lamp'), description: 'Solid spun brass with a linen shade and a warm dimmable glow. Develops a soft patina.' },
  { id: 'p4', name: 'Fjord Wool Throw', category: 'Textiles', price: 210, stock: 20, image: img('halden-throw'), description: 'Woven from undyed merino in a heavy herringbone. Generous, warm and made to last.' },
  { id: 'p5', name: 'Linen Bedding Set', category: 'Textiles', price: 340, stock: 3, image: img('halden-linen'), description: 'Stonewashed European flax linen. Duvet cover and two pillowcases.' },
  { id: 'p6', name: 'Oak Serving Board', category: 'Home', price: 96, stock: 25, image: img('halden-board'), description: 'Cut from a single piece of sustainably harvested oak and finished with food-safe oil.' },
  { id: 'p7', name: 'Soren Weekender', category: 'Carry', price: 590, stock: 4, image: img('halden-bag'), description: 'Waxed canvas with leather trim and a solid brass zip. Fits in an overhead locker.' },
  { id: 'p8', name: 'Pillar Candle, Fig & Cedar', category: 'Light', price: 58, stock: 40, image: img('halden-candle'), description: 'Hand-poured soy wax in a reusable ceramic vessel. Burns for 60 hours.' },
]
