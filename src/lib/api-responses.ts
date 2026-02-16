import { NextResponse } from 'next/server';

export const apiResponse = {
    success: (data: any, message = 'Success', status = 200) => {
        return NextResponse.json({
            success: true,
            message,
            data
        }, { status });
    },

    error: (message = 'Internal Server Error', status = 500, errors: any = null) => {
        return NextResponse.json({
            success: false,
            message,
            errors
        }, { status });
    },

    unauthorized: (message = 'Unauthorized') => {
        return apiResponse.error(message, 401);
    },

    forbidden: (message = 'Forbidden') => {
        return apiResponse.error(message, 403);
    },

    notFound: (message = 'Resource not found') => {
        return apiResponse.error(message, 404);
    },

    badRequest: (message = 'Bad Request', errors: any = null) => {
        return apiResponse.error(message, 400, errors);
    }
};
