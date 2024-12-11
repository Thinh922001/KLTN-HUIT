import Redis from 'ioredis';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis('redis://default:UrUeINhOYEMkjkHFVclvPTIjBeqgwqkC@junction.proxy.rlwy.net:38693');

    this.client.on('connect', () => {
      console.log('Kết nối Redis thành công!');
    });

    this.client.on('error', (err) => {
      console.error('Lỗi khi kết nối Redis:', err);
    });
  }

  async set(key: string, value: any, ttl?: number) {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, data, 'EX', ttl);
    } else {
      await this.client.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
