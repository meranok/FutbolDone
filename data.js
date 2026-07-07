const DISTRICTS = ['Chilonzor', 'Yunusobod', "Mirzo Ulug'bek", 'Shayxontohur', 'Yakkasaroy', 'Sergeli'];
const FORMATS = ['5x5', '6x6', '7x7', '11x11'];
const initialPitches = [
  { id: 1, name: 'Chilonzor Arena', district: 'Chilonzor', price: 180000, format: '5x5', rating: 4.8, reviews: 124, amenities: ['Yoritilgan', 'Dush', 'Parking'] },
  { id: 2, name: 'Yunusobod Sport Complex', district: 'Yunusobod', price: 220000, format: '7x7', rating: 4.6, reviews: 89, amenities: ['Yopiq maydon', 'Dush', 'Kafe'] },
  { id: 3, name: 'Green Field Yakkasaroy', district: 'Yakkasaroy', price: 250000, format: '6x6', rating: 4.9, reviews: 201, amenities: ["Sun'iy o'tqozon", 'Parking'] },
  { id: 4, name: 'Mirzo Ulug'bek Stadium', district: 'Mirzo Ulug'bek', price: 160000, format: '5x5', rating: 4.5, reviews: 67, amenities: ['Yoritilgan', 'Kiyinish xonasi'] },
  { id: 5, name: 'Sergeli Football House', district: 'Sergeli', price: 140000, format: '5x5', rating: 4.4, reviews: 45, amenities: ['Parking', 'Dush'] },
  { id: 6, name: 'Shayxontohur Arena', district: 'Shayxontohur', price: 200000, format: '7x7', rating: 4.7, reviews: 156, amenities: ['Yopiq maydon', 'Kafe', 'Parking'] },
];
const slotsToday = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00', '21:00'];
const bookedSlots = ['11:00', '16:00', '20:00'];
const mockBookings = [
  { id: 1, pitch: 'Chilonzor Arena', date: '2026-07-08', time: '19:00', status: 'confirmed' },
  { id: 2, pitch: 'Green Field Yakkasaroy', date: '2026-07-11', time: '20:00', status: 'pending' },
  { id: 3, pitch: 'Yunusobod Sport Complex', date: '2026-06-28', time: '18:00', status: 'completed' },
];
window.DISTRICTS = DISTRICTS;
window.FORMATS = FORMATS;
window.initialPitches = initialPitches;
window.slotsToday = slotsToday;
window.bookedSlots = bookedSlots;
window.mockBookings = mockBookings;
