import { categorizeESP, parseReceivingDomain } from '../../lib/services/esp-classifier';

describe('categorizeESP', () => {
  describe('Google/Gmail detection', () => {
    it('should detect Google workspace names', () => {
      expect(categorizeESP('Google Workspace')).toBe('Google/Gmail');
      expect(categorizeESP('google workspace')).toBe('Google/Gmail');
      expect(categorizeESP('GOOGLE')).toBe('Google/Gmail');
    });

    it('should detect Gmail references', () => {
      expect(categorizeESP('gmail')).toBe('Google/Gmail');
      expect(categorizeESP('Gmail Account')).toBe('Google/Gmail');
      expect(categorizeESP('test@gmail')).toBe('Google/Gmail');
    });
  });

  describe('Outlook/Microsoft detection', () => {
    it('should detect Outlook workspace names', () => {
      expect(categorizeESP('Outlook')).toBe('Outlook/Microsoft');
      expect(categorizeESP('outlook workspace')).toBe('Outlook/Microsoft');
      expect(categorizeESP('OUTLOOK')).toBe('Outlook/Microsoft');
    });

    it('should detect Microsoft references', () => {
      expect(categorizeESP('Microsoft 365')).toBe('Outlook/Microsoft');
      expect(categorizeESP('microsoft')).toBe('Outlook/Microsoft');
      expect(categorizeESP('Office365')).toBe('Outlook/Microsoft');
      expect(categorizeESP('O365')).toBe('Outlook/Microsoft');
    });

    it('should detect Hotmail references', () => {
      expect(categorizeESP('@hotmail')).toBe('Outlook/Microsoft');
      expect(categorizeESP('hotmail account')).toBe('Outlook/Microsoft');
    });
  });

  describe('Custom Domain detection', () => {
    it('should detect custom domain keywords', () => {
      expect(categorizeESP('Custom Domain')).toBe('Custom Domain');
      expect(categorizeESP('custom')).toBe('Custom Domain');
      expect(categorizeESP('domain')).toBe('Custom Domain');
    });

    it('should detect @ symbol as custom domain indicator', () => {
      expect(categorizeESP('@company.com')).toBe('Custom Domain');
      expect(categorizeESP('workspace@example')).toBe('Custom Domain');
    });
  });

  describe('Unknown classification', () => {
    it('should return Unknown for unrecognized names', () => {
      expect(categorizeESP('Random Workspace')).toBe('Unknown');
      expect(categorizeESP('Test')).toBe('Unknown');
      expect(categorizeESP('123')).toBe('Unknown');
      expect(categorizeESP('')).toBe('Unknown');
    });
  });

  describe('case insensitivity', () => {
    it('should handle mixed case inputs', () => {
      expect(categorizeESP('GoOgLe WoRkSpAcE')).toBe('Google/Gmail');
      expect(categorizeESP('OuTlOoK')).toBe('Outlook/Microsoft');
      expect(categorizeESP('CuStOm DoMaIn')).toBe('Custom Domain');
    });
  });
});

describe('parseReceivingDomain', () => {
  describe('Gmail detection', () => {
    it('should detect gmail.com addresses', () => {
      expect(parseReceivingDomain('user@gmail.com')).toBe('Gmail');
      expect(parseReceivingDomain('test.user@gmail.com')).toBe('Gmail');
      expect(parseReceivingDomain('USER@GMAIL.COM')).toBe('Gmail');
    });

    it('should detect googlemail addresses', () => {
      expect(parseReceivingDomain('user@googlemail.com')).toBe('Gmail');
    });
  });

  describe('Outlook detection', () => {
    it('should detect outlook.com addresses', () => {
      expect(parseReceivingDomain('user@outlook.com')).toBe('Outlook');
      expect(parseReceivingDomain('test@OUTLOOK.COM')).toBe('Outlook');
    });

    it('should detect hotmail.com addresses', () => {
      expect(parseReceivingDomain('user@hotmail.com')).toBe('Outlook');
      expect(parseReceivingDomain('test@HOTMAIL.COM')).toBe('Outlook');
    });

    it('should detect live.com addresses', () => {
      expect(parseReceivingDomain('user@live.com')).toBe('Outlook');
    });

    it('should detect msn.com addresses', () => {
      expect(parseReceivingDomain('user@msn.com')).toBe('Outlook');
    });

    it('should detect domains containing outlook', () => {
      expect(parseReceivingDomain('user@outlook.co.uk')).toBe('Outlook');
      expect(parseReceivingDomain('user@hotmail.co.uk')).toBe('Outlook');
    });
  });

  describe('Custom domain detection', () => {
    it('should detect custom company domains', () => {
      expect(parseReceivingDomain('user@company.com')).toBe('Custom');
      expect(parseReceivingDomain('admin@example.org')).toBe('Custom');
      expect(parseReceivingDomain('contact@business.net')).toBe('Custom');
    });

    it('should detect custom domains with subdomains', () => {
      expect(parseReceivingDomain('user@mail.company.com')).toBe('Custom');
      expect(parseReceivingDomain('admin@corp.example.org')).toBe('Custom');
    });

    it('should detect international domains', () => {
      expect(parseReceivingDomain('user@company.co.uk')).toBe('Custom');
      expect(parseReceivingDomain('user@example.de')).toBe('Custom');
      expect(parseReceivingDomain('user@business.jp')).toBe('Custom');
    });
  });

  describe('Unknown classification', () => {
    it('should return Unknown for invalid email formats', () => {
      expect(parseReceivingDomain('not-an-email')).toBe('Unknown');
      expect(parseReceivingDomain('missing-at-sign.com')).toBe('Unknown');
      expect(parseReceivingDomain('@nodomain')).toBe('Unknown');
    });

    it('should return Unknown for empty or malformed emails', () => {
      expect(parseReceivingDomain('')).toBe('Unknown');
      expect(parseReceivingDomain('user@')).toBe('Unknown');
      expect(parseReceivingDomain('@')).toBe('Unknown');
    });
  });

  describe('edge cases', () => {
    it('should handle emails with multiple @ symbols (use first split)', () => {
      // Email addresses shouldn't have multiple @, but if they do, split takes first
      expect(parseReceivingDomain('user@@gmail.com')).toBe('Gmail');
    });

    it('should handle emails with special characters', () => {
      expect(parseReceivingDomain('user+tag@gmail.com')).toBe('Gmail');
      expect(parseReceivingDomain('user.name@company.com')).toBe('Custom');
      expect(parseReceivingDomain('user_name@outlook.com')).toBe('Outlook');
    });

    it('should be case insensitive', () => {
      expect(parseReceivingDomain('USER@GMAIL.COM')).toBe('Gmail');
      expect(parseReceivingDomain('User@Outlook.Com')).toBe('Outlook');
      expect(parseReceivingDomain('ADMIN@COMPANY.COM')).toBe('Custom');
    });
  });
});
