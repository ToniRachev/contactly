import { MESSAGES } from '@/lib/constants/messages';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseAndValidateSigninInput, parseAndValidateSignupInput, signInUser } from '@/lib/actions/auth/auth.helpers';
import * as serverModule from '@/lib/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

describe('parseAndValidateSigninInput', () => {
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

describe('parseAndValidateSignupInput', () => {
    it('should validate valid form data', () => {
        const credentials = {
            email: 'test@gmail.com',
            password: 'password',
            confirmPassword: 'password',
            firstName: 'Test First Name',
            lastName: 'Test Last Name',
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(credentials)) {
            formData.append(key, value);
        }

        const { data, result } = parseAndValidateSignupInput(formData);

        expect(result.success).toBe(true);
        expect(data).toMatchObject(credentials);
    })

    it('should return validation errors for invalid form data', () => {
        const credentials = {
            email: 'test',
            password: 'password',
            confirmPassword: 'password',
            firstName: 'Test First Name',
            lastName: 'Test Last Name',
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(credentials)) {
            formData.append(key, value);
        }

        const { result } = parseAndValidateSignupInput(formData);

        expect(result.success).toBe(false);
        expect(result.error?.formErrors.fieldErrors).toMatchObject({
            email: [MESSAGES.validation.invalidEmail],
        })
    })

    it('should return validation error when passwords do not match', () => {
        const credentials = {
            email: 'test@gmail.com',
            password: 'password',
            confirmPassword: 'confirmPassword',
            firstName: 'Test First Name',
            lastName: 'Test Last Name',
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(credentials)) {
            formData.append(key, value);
        }

        const { result } = parseAndValidateSignupInput(formData);

        expect(result.success).toBe(false);
        expect(result.error?.formErrors.fieldErrors).toMatchObject({
            confirmPassword: [MESSAGES.validation.signup.passwordsDontMatch],
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
        } as unknown as SupabaseClient;

        vi.spyOn(serverModule, 'createClient').mockResolvedValue(mockClient as SupabaseClient);

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
        } as unknown as SupabaseClient;

        vi.spyOn(serverModule, 'createClient').mockResolvedValue(mockClient as SupabaseClient);

        const credentials = {
            email: 'test@abv.bg',
            password: '12345ab'
        }

        await expect(signInUser(credentials)).rejects.toThrow('Invalid credentials');
    });
});