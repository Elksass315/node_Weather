import { createClient } from 'redis';
import config from 'config';


const redisClint = createClient({
    password: config.get('redisPass'),
    socket: {
        host: config.get('redisHost'),
        port: 13015
    }
});

export default async function () {

    redisClint.on('error', err => console.log('Redis Client Error', err));
    await redisClint.connect();
    console.log('Redis Connected');

}
export { redisClint };
