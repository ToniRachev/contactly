import { MESSAGES } from '@/lib/constants/messages';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseAndValidateSigninInput, signInUser } from './helpers';
import * as serverModule from '@/lib/utils/supabase/server';

describe('parseAndValidateInput', () => {
    it('should validate valid form data', () => {
        const email = 'test@abv.bg';
        const password = '12345ab';

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const { data, result } = parseAndValidateSigninInput(formData);

        expect(result.success).toBe(true);
        expect(data.email).toBe(email);
        expect(data.password).toBe(password);
    })

    it('should return validation errors for invalid form data', () => {
        const email = 'invalid-email';
        const password = '123';

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const { result } = parseAndValidateSigninInput(formData);

        expect(result.success).toBe(false)
        expect(result.error?.formErrors.fieldErrors).toMatchObject({
            email: [MESSAGES.validation.invalidEmail],
            password: [MESSAGES.validation.password.minLength]
        })
    })
})

describe('signInUser', () => {
    const mockSignIn = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call signInWithPassword with correct credentials', async () => {
        const mockClient = {
            auth: {
                signInWithPassword: mockSignIn.mockResolvedValue({ error: null })
            }
        };

        vi.spyOn(serverModule, 'createClient').mockResolvedValue(mockClient as any);

        const credentials = {
            email: 'test@example.com',
            password: '12345678'
        };

        await expect(signInUser(credentials)).resolves.toBeUndefined();
        expect(mockSignIn).toHaveBeenCalledWith(credentials);
    });

    it('should throw if signInWithPassword returns error', async () => {
        const error = new Error('Invalid credentials')

        const mockClient = {
            auth: {
                signInWithPassword: mockSignIn.mockResolvedValue({ error })
            }
        }

        vi.spyOn(serverModule, 'createClient').mockResolvedValue(mockClient as any);

        const credentials = {
            email: 'test@abv.bg',
            password: '12345ab'
        }

        await expect(signInUser(credentials)).rejects.toThrow('Invalid credentials');
    });
});