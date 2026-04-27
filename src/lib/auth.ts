import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
    id: string;
    role: string;
    nama?: string;
    iat: number;
    exp: number;
}

export function generateToken(id: string, role: string, nama?: string): string {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || '30m') as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign({ id, role, nama }, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
}

export async function getUserFromRequest(request: NextRequest): Promise<IUser | null> {
    const token = getTokenFromRequest(request);

    if (!token) {
        return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return null;
    }

    const user = {
        _id: decoded.id,
        role: decoded.role,
        nama: decoded.nama,
    } as unknown as IUser;

    return user;
}

export async function requireAuth(request: NextRequest): Promise<{ user: IUser } | { error: string; status: number }> {
    const user = await getUserFromRequest(request);

    if (!user) {
        return { error: 'Not authorized, token failed', status: 401 };
    }

    return { user };
}

export async function requireAdmin(request: NextRequest): Promise<{ user: IUser } | { error: string; status: number }> {
    const result = await requireAuth(request);

    if ('error' in result) {
        return result;
    }

    if (result.user.role !== 'admin') {
        return { error: 'Not authorized as admin', status: 403 };
    }

    return result;
}
