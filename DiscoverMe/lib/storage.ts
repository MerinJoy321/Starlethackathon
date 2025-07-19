import { promises as fs } from 'fs';
import path from 'path';
import { SessionData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export class JSONStorage {
  private async ensureDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  async saveSession(sessionData: SessionData) {
    await this.ensureDir();
    const filePath = path.join(DATA_DIR, 'sessions.json');
    
    let sessions = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      sessions = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    // Convert dates to ISO strings for JSON storage
    const sessionForStorage = {
      ...sessionData,
      startTimestamp: sessionData.startTimestamp.toISOString(),
      endTimestamp: sessionData.endTimestamp.toISOString(),
    };
    
    sessions.push(sessionForStorage);
    await fs.writeFile(filePath, JSON.stringify(sessions, null, 2));
  }

  async getSessions(): Promise<SessionData[]> {
    try {
      const filePath = path.join(DATA_DIR, 'sessions.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const sessions = JSON.parse(data);
      
      // Convert ISO strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        startTimestamp: new Date(session.startTimestamp),
        endTimestamp: new Date(session.endTimestamp),
      }));
    } catch {
      return [];
    }
  }

  async saveProfile(profileData: any) {
    await this.ensureDir();
    const filePath = path.join(DATA_DIR, 'profiles.json');
    
    let profiles = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      profiles = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    profiles.push(profileData);
    await fs.writeFile(filePath, JSON.stringify(profiles, null, 2));
  }

  async getProfiles(): Promise<any[]> {
    try {
      const filePath = path.join(DATA_DIR, 'profiles.json');
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
} 