/**
 * @file Carethia API Client
 * @description Simple fetch-based API client for frontend
 * 
 * Usage:
 * import { api } from '@/lib/api'
 * const caregivers = await api.get('/caregivers')
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface RequestOptions extends RequestInit {
    skipAuth?: boolean
}

class ApiClient {
    private getAuthHeader = async (): Promise<string | null> => {
        // In production, get token from cookies or localStorage
        // const token = getCookie('authToken')
        // return token ? `Bearer ${token}` : null
        return null
    }

    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {},
    ): Promise<T> {
        const { skipAuth = false, ...fetchOptions } = options
        const url = `${API_URL}${endpoint}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers as Record<string, string>),
        }

        if (!skipAuth) {
            const authHeader = await this.getAuthHeader()
            if (authHeader) {
                headers['Authorization'] = authHeader
            }
        }

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
            })

            if (!response.ok) {
                const error = await response.json().catch(() => ({}))
                throw new Error(error.message || `API error: ${response.statusText}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    get<T = any>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'GET' })
    }

    post<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        })
    }

    put<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        })
    }

    delete<T = any>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    }
}

export const api = new ApiClient()

