export interface User {
    _id: string;
    nama: string;
    email: string;
    role: 'user' | 'admin';
    kelas?: string;
    usia?: number;
    jenis_kelamin?: string;
    token: string;
}

export interface RegisterData {
    nama: string;
    email: string;
    password: string;
    kelas?: string;
    usia?: number;
    jenis_kelamin?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (userData: RegisterData) => Promise<User>;
    logout: () => void;
}
