import { describe, it, expect } from 'vitest'
import useValidate from './validate';

describe('CPF', () => {
    const validate = useValidate();

    it('should be valid', () => {
        expect(validate.isValidCPF('023.194.990-16')).toBeTruthy();
        expect(validate.isValidCPF('02319499016')).toBeTruthy();
    });

    it('should be invalid', () => {
        expect(validate.isValidCPF('023.194.990-15')).toBeFalsy();
        expect(validate.isValidCPF('02319499015')).toBeFalsy();
        expect(validate.isValidCPF('883.173')).toBeFalsy();
        expect(validate.isValidCPF('46.552.490/0001-30')).toBeFalsy();
    });
});

describe('CNPJ', () => {
    const validate = useValidate();

    it('should be valid', () => {
        expect(validate.isValidCNPJ('46.552.490/0001-30')).toBeTruthy();
        expect(validate.isValidCNPJ('46552490000130')).toBeTruthy();
    });

    it('should be invalid', () => {
        expect(validate.isValidCNPJ('46.552.490/0001-15')).toBeFalsy();
        expect(validate.isValidCNPJ('46552490000115')).toBeFalsy();
        expect(validate.isValidCNPJ('46.490/0001-30')).toBeFalsy();
        expect(validate.isValidCNPJ('023.194.990-16')).toBeFalsy();
    });
})