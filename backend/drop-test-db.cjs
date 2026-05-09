const { spawn } = require('child_process');

console.log('🗑️ Dropping test database...');

const dropTestDatabase = () => {
  return new Promise((resolve, reject) => {
    const child = spawn('mongosh --eval "use test; db.dropDatabase(); print(\'Test database dropped\')"', { shell: true });
    
    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Test database dropped successfully');
      } else {
        console.log(`❌ Failed to drop test database with code ${code}`);
      }
      resolve();
    });
  });
};

dropTestDatabase();
