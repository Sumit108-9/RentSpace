// MongoDB script to merge test database into rentspace
// Usage: node merge-dbs.js

const { spawn } = require('child_process');

console.log('🔄 Starting database merge: test -> rentspace');

// Command to merge each collection
const commands = [
  // Merge users
  `mongosh --eval "use test; var docs = db.users.find({}).toArray(); use rentspace; db.users.insertMany(docs); print('Migrated', docs.length, 'users')"`,
  
  // Merge products
  `mongosh --eval "use test; var docs = db.products.find({}).toArray(); use rentspace; db.products.insertMany(docs); print('Migrated', docs.length, 'products')"`,
  
  // Merge orders
  `mongosh --eval "use test; var docs = db.orders.find({}).toArray(); use rentspace; db.orders.insertMany(docs); print('Migrated', docs.length, 'orders')"`,
  
  // Merge carts
  `mongosh --eval "use test; var docs = db.carts.find({}).toArray(); use rentspace; db.carts.insertMany(docs); print('Migrated', docs.length, 'carts')"`,
  
  // Merge counters
  `mongosh --eval "use test; var docs = db.counters.find({}).toArray(); use rentspace; db.counters.insertMany(docs); print('Migrated', docs.length, 'counters')"`,
  
  // Merge otps
  `mongosh --eval "use test; var docs = db.otps.find({}).toArray(); use rentspace; db.otps.insertMany(docs); print('Migrated', docs.length, 'otps')"`,
  
  // Merge passwordresets
  `mongosh --eval "use test; var docs = db.passwordresets.find({}).toArray(); use rentspace; db.passwordresets.insertMany(docs); print('Migrated', docs.length, 'passwordresets')"`
];

// Execute commands sequentially
const executeCommands = async () => {
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    console.log(`📦 Executing: ${command.substring(0, 50)}...`);
    
    try {
      await new Promise((resolve, reject) => {
        const child = spawn(command, { shell: true });
        
        child.stdout.on('data', (data) => {
          process.stdout.write(data);
        });
        
        child.stderr.on('data', (data) => {
          process.stderr.write(data);
        });
        
        child.on('close', (code) => {
          if (code === 0) {
            console.log(`✅ Command ${i + 1}/${commands.length} completed`);
          } else {
            console.log(`❌ Command ${i + 1}/${commands.length} failed with code ${code}`);
          }
          resolve();
        });
      });
      
      // Small delay between commands
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error executing command ${i + 1}:`, error.message);
    }
  }
};

// Main execution
const main = async () => {
  try {
    await executeCommands();
    console.log('🎉 Database merge completed!');
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    process.exit(1);
  }
};

// Check if drop flag is provided
if (process.argv.includes('--drop-only')) {
  dropTestDb();
} else {
  main();
}
