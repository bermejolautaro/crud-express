import jwt from 'jsonwebtoken';

export class AuthService {
    constructor(private readonly tokenSecret: string) { }

    public signup(username: string): string | null {
        if(username !== 'admin') {
            return null;
        }
        
        return this.generateAccessToken(username);
    }

    private generateAccessToken(username: string) {
        return jwt.sign({ username }, this.tokenSecret, { expiresIn: '30m' })
    }
}