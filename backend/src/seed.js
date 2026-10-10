const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const runSeed = async () => {
  console.log('🌱 Seeding backend specific data (Users, Owners, Rooms, Demo Meetings)...');

  try {
    await pool.query('DELETE FROM room_ratings; DELETE FROM rating_photos; DELETE FROM room_photos; DELETE FROM meeting_history; DELETE FROM meeting_equipment; DELETE FROM meeting_participants; DELETE FROM meetings; DELETE FROM room_equipment; DELETE FROM rooms; DELETE FROM equipment; DELETE FROM users;');
    await pool.query('ALTER TABLE meetings AUTO_INCREMENT = 1; ALTER TABLE users AUTO_INCREMENT = 1; ALTER TABLE rooms AUTO_INCREMENT = 1; ALTER TABLE equipment AUTO_INCREMENT = 1;');

    // Users
    const passwordHash = await bcrypt.hash('user123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);
    const ownerHash = await bcrypt.hash('owner123', 10);
    
    await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES ?', [[
        ['Admin', 'admin@test.com', adminHash, 'ADMIN'],
        ['Asha', 'asha@corp.com', passwordHash, 'USER'],
        ['Ravi', 'ravi@corp.com', passwordHash, 'USER'],
        ['Meera', 'meera@corp.com', passwordHash, 'USER'],
        ['Owner 1', 'owner1@test.com', ownerHash, 'OWNER'],
        ['Owner 2', 'owner2@test.com', ownerHash, 'OWNER']
    ]]);

    // Rooms (Owner 1: user id 5, Owner 2: user id 6)
    await pool.query('INSERT INTO rooms (name, floor, capacity, owner_id, pricing_type, price_per_hour, price_per_day) VALUES ?', [[
        ['Room A', 1, 4, 5, 'FREE', null, null],
        ['Room B', 1, 6, 5, 'HOURLY', 300, null],
        ['Room C', 2, 8, 5, 'HOURLY', 500, null],
        ['Room D', 2, 12, 6, 'DAILY', null, 3000],
        ['Room E', 3, 20, 6, 'BOTH', 1000, 5000],
        ['Room F', 3, 30, 6, 'BOTH', 1500, 8000]
    ]]);

    // Equipment
    await pool.query('INSERT INTO equipment (name) VALUES ?', [[
        ['Projector'], ['Whiteboard'], ['Video Conferencing'], ['Microphone']
    ]]);

    // Room Equipment
    await pool.query('INSERT INTO room_equipment (room_id, equipment_id, is_working) VALUES ?', [
        [
            [1, 2, 1], 
            [2, 1, 0], // Broken
            [3, 1, 1], [3, 2, 1], [3, 3, 1]
        ]
    ]);

    // Demo Meetings (tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    // Create 1 valid meeting (1 hour in Room C - Hourly 500)
    await pool.query(`INSERT INTO meetings (title, room_id, organizer_id, start_time, end_time, attendees, total_cost, price_note) VALUES ('Team Sync', 3, 2, '${dateStr} 10:00:00', '${dateStr} 11:00:00', 5, 500, '1 hours x 500 INR')`);
    await pool.query(`INSERT INTO meeting_participants (meeting_id, user_id) VALUES (1, 2), (1, 3)`);

    console.log('✅ Backend Seed Complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

runSeed();
