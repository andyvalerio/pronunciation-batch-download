import * as ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  const HOST = process.env.FTP_HOST;
  const USER = process.env.FTP_USER;
  const PASSWORD = process.env.FTP_PASSWORD;
  const REMOTE_ROOT = process.env.FTP_REMOTE_ROOT || '/public_html';
  const LOCAL_BUILD_DIR = path.join(__dirname, 'dist'); // Assuming Vite/React default build dir

  if (!HOST || !USER || !PASSWORD) {
    console.error('❌ Error: Missing FTP credentials in .env file (FTP_HOST, FTP_USER, FTP_PASSWORD)');
    process.exit(1);
  }

  try {
    console.log(`🚀 Connecting to ${HOST}...`);
    await client.access({
      host: HOST,
      user: USER,
      password: PASSWORD,
      secure: true,
      // This is required for shared hosting where the certificate (e.g. *.hstgr.io)
      // doesn't match your specific FTP domain (e.g. ftp.yoursite.com).
      secureOptions: { 
        rejectUnauthorized: false 
      }
    });

    console.log(`📂 Uploading from ${LOCAL_BUILD_DIR} to ${REMOTE_ROOT}...`);
    
    // Ensure remote directory exists
    await client.ensureDir(REMOTE_ROOT);
    
    // Clear the remote directory before uploading (optional, but good for clean deploys)
    // await client.clearWorkingDir(); 
    
    // Upload the contents of the local build directory to the remote root
    await client.uploadFromDir(LOCAL_BUILD_DIR, REMOTE_ROOT);

    console.log('✅ Deploy successful!');
  } catch (err) {
    console.error('❌ Deploy failed:', err);
  } finally {
    client.close();
  }
}

deploy();