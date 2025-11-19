import { gradeESP, buildESPMatrix } from '../../lib/services/esp-performance';
import { Campaign, Lead } from '../../lib/types/campaign';

describe('gradeESP', () => {
  describe('A+ grade', () => {
    it('should return A+ for >3% reply rate and <0.5% bounce rate', () => {
      expect(gradeESP(3.1, 0.4)).toBe('A+');
      expect(gradeESP(5.0, 0.3)).toBe('A+');
      expect(gradeESP(10.0, 0.1)).toBe('A+');
    });
  });

  describe('A grade', () => {
    it('should return A for 2.5-3% reply rate and <0.5% bounce rate', () => {
      expect(gradeESP(2.5, 0.4)).toBe('A');
      expect(gradeESP(2.8, 0.3)).toBe('A');
      expect(gradeESP(3.0, 0.2)).toBe('A');
    });
  });

  describe('B grade', () => {
    it('should return B for 2-2.5% reply rate and 0.5-1% bounce rate', () => {
      expect(gradeESP(2.0, 0.5)).toBe('B');
      expect(gradeESP(2.2, 0.7)).toBe('B');
      expect(gradeESP(2.5, 1.0)).toBe('B');
    });
  });

  describe('C grade', () => {
    it('should return C for <2% reply rate and 1-2% bounce rate', () => {
      expect(gradeESP(1.5, 1.0)).toBe('C');
      expect(gradeESP(1.0, 1.5)).toBe('C');
      expect(gradeESP(0.5, 2.0)).toBe('C');
    });
  });

  describe('D grade', () => {
    it('should return D for combinations that do not meet A-C criteria', () => {
      // Good reply rate but higher bounce rate
      expect(gradeESP(3.5, 1.0)).toBe('D');
      expect(gradeESP(2.8, 0.8)).toBe('D');
      
      // Low reply rate but acceptable bounce rate
      expect(gradeESP(1.5, 0.3)).toBe('D');
      expect(gradeESP(0.5, 0.5)).toBe('D');
    });
  });

  describe('F grade', () => {
    it('should return F for >2% bounce rate regardless of reply rate', () => {
      expect(gradeESP(10.0, 2.1)).toBe('F');
      expect(gradeESP(5.0, 3.0)).toBe('F');
      expect(gradeESP(0.0, 5.0)).toBe('F');
      expect(gradeESP(3.5, 2.5)).toBe('F');
    });
  });

  describe('edge cases', () => {
    it('should handle zero reply rate', () => {
      expect(gradeESP(0, 0.3)).toBe('D');
      expect(gradeESP(0, 1.5)).toBe('C');
      expect(gradeESP(0, 2.5)).toBe('F');
    });

    it('should handle zero bounce rate', () => {
      expect(gradeESP(3.5, 0)).toBe('A+');
      expect(gradeESP(2.8, 0)).toBe('A');
      expect(gradeESP(1.5, 0)).toBe('D');
    });

    it('should handle boundary values', () => {
      // Exact boundaries
      expect(gradeESP(3.0, 0.5)).toBe('D'); // At A boundary but bounce is at 0.5 (not < 0.5)
      expect(gradeESP(2.5, 0.5)).toBe('B'); // At B boundaries (2.0-2.5 reply, 0.5-1.0 bounce)
      expect(gradeESP(2.0, 0.5)).toBe('B'); // At B boundaries
      expect(gradeESP(2.5, 0.49)).toBe('A'); // Just under bounce threshold for A
      expect(gradeESP(3.01, 0.49)).toBe('A+'); // Just over reply threshold for A+
    });
  });
});

describe('buildESPMatrix', () => {
  describe('basic functionality', () => {
    it('should build matrix with single campaign and leads', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Test Campaign',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 100,
          bounced: 5,
          unique_replies: 10,
          interested: 5,
          unsubscribed: 2,
          total_leads_contacted: 100,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'replied',
              replied: true,
              interested: false,
              bounced: false,
            },
          ],
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@outlook.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'bounced',
              replied: false,
              interested: false,
              bounced: true,
            },
          ],
        },
        {
          id: 3,
          first_name: 'Bob',
          last_name: 'Johnson',
          email: 'bob@company.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'sent',
              replied: false,
              interested: false,
              bounced: false,
            },
          ],
        },
      ];

      const workspaceNames = new Map([[1, 'Google Workspace']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      expect(result).toHaveLength(3); // Gmail, Outlook, Custom

      // Find Gmail entry
      const gmailEntry = result.find(
        r => r.sending_esp === 'Google/Gmail' && r.receiving_domain_type === 'Gmail'
      );
      expect(gmailEntry).toBeDefined();
      expect(gmailEntry?.total_sent).toBe(1);
      expect(gmailEntry?.total_delivered).toBe(1);
      expect(gmailEntry?.total_replies).toBe(1);
      expect(gmailEntry?.total_bounced).toBe(0);
      expect(gmailEntry?.reply_rate).toBe(100); // 1/1 * 100
      expect(gmailEntry?.bounce_rate).toBe(0);

      // Find Outlook entry
      const outlookEntry = result.find(
        r => r.sending_esp === 'Google/Gmail' && r.receiving_domain_type === 'Outlook'
      );
      expect(outlookEntry).toBeDefined();
      expect(outlookEntry?.total_sent).toBe(1);
      expect(outlookEntry?.total_delivered).toBe(0);
      expect(outlookEntry?.total_bounced).toBe(1);
      expect(outlookEntry?.bounce_rate).toBe(100);
    });

    it('should aggregate multiple campaigns correctly', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Campaign 1',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 50,
          bounced: 2,
          unique_replies: 5,
          interested: 2,
          unsubscribed: 1,
          total_leads_contacted: 50,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
        {
          id: 2,
          name: 'Campaign 2',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 50,
          bounced: 3,
          unique_replies: 8,
          interested: 4,
          unsubscribed: 0,
          total_leads_contacted: 50,
          created_at: '2025-02-01',
          updated_at: '2025-02-10',
        },
      ];

      const leads: Lead[] = [
        // Campaign 1 lead
        {
          id: 1,
          first_name: 'Alice',
          last_name: 'Test',
          email: 'alice@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'replied',
              replied: true,
              interested: false,
              bounced: false,
            },
          ],
        },
        // Campaign 2 lead
        {
          id: 2,
          first_name: 'Bob',
          last_name: 'Test',
          email: 'bob@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 2,
              status: 'replied',
              replied: true,
              interested: true,
              bounced: false,
            },
          ],
        },
      ];

      const workspaceNames = new Map([[1, 'Custom Domain']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      const gmailEntry = result.find(
        r => r.sending_esp === 'Custom Domain' && r.receiving_domain_type === 'Gmail'
      );
      
      expect(gmailEntry).toBeDefined();
      expect(gmailEntry?.total_sent).toBe(2); // Aggregated from both campaigns
      expect(gmailEntry?.total_replies).toBe(2);
      expect(gmailEntry?.total_bounced).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle campaigns with no leads', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Empty Campaign',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 0,
          bounced: 0,
          unique_replies: 0,
          interested: 0,
          unsubscribed: 0,
          total_leads_contacted: 0,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [];
      const workspaceNames = new Map([[1, 'Google Workspace']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      expect(result).toHaveLength(0); // No ESP pairs created
    });

    it('should handle 100% bounce rate', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'All Bounced',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 10,
          bounced: 10,
          unique_replies: 0,
          interested: 0,
          unsubscribed: 0,
          total_leads_contacted: 10,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [
        {
          id: 1,
          first_name: 'Bounced',
          last_name: 'User',
          email: 'bounced@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'bounced',
              replied: false,
              interested: false,
              bounced: true,
            },
          ],
        },
      ];

      const workspaceNames = new Map([[1, 'Outlook']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      const entry = result[0];
      expect(entry.total_sent).toBe(1);
      expect(entry.total_bounced).toBe(1);
      expect(entry.total_delivered).toBe(0);
      expect(entry.bounce_rate).toBe(100);
      expect(entry.reply_rate).toBe(0); // 0/0 = 0
      expect(entry.grade).toBe('F');
    });

    it('should handle unknown workspace', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Campaign',
          workspace_id: 999,
          status: 'completed',
          emails_sent: 5,
          bounced: 0,
          unique_replies: 1,
          interested: 0,
          unsubscribed: 0,
          total_leads_contacted: 5,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [
        {
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'replied',
              replied: true,
              interested: false,
              bounced: false,
            },
          ],
        },
      ];

      const workspaceNames = new Map([[1, 'Google Workspace']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      // Should classify as Unknown ESP since workspace 999 not in map
      const entry = result[0];
      expect(entry.sending_esp).toBe('Unknown');
    });

    it('should handle invalid email addresses', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Campaign',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 5,
          bounced: 0,
          unique_replies: 0,
          interested: 0,
          unsubscribed: 0,
          total_leads_contacted: 5,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [
        {
          id: 1,
          first_name: 'Invalid',
          last_name: 'Email',
          email: 'not-an-email',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'sent',
              replied: false,
              interested: false,
              bounced: false,
            },
          ],
        },
        {
          id: 2,
          first_name: 'Empty',
          last_name: 'Email',
          email: '',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'sent',
              replied: false,
              interested: false,
              bounced: false,
            },
          ],
        },
      ];

      const workspaceNames = new Map([[1, 'Google Workspace']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      // Should categorize both as Unknown domain
      const unknownEntry = result.find(
        r => r.sending_esp === 'Google/Gmail' && r.receiving_domain_type === 'Unknown'
      );
      expect(unknownEntry).toBeDefined();
      expect(unknownEntry?.total_sent).toBe(2);
    });

    it('should handle multiple ESP types', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Google Campaign',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 10,
          bounced: 0,
          unique_replies: 2,
          interested: 1,
          unsubscribed: 0,
          total_leads_contacted: 10,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
        {
          id: 2,
          name: 'Outlook Campaign',
          workspace_id: 2,
          status: 'completed',
          emails_sent: 10,
          bounced: 1,
          unique_replies: 1,
          interested: 0,
          unsubscribed: 0,
          total_leads_contacted: 10,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = [
        {
          id: 1,
          first_name: 'User1',
          last_name: 'Test',
          email: 'user1@gmail.com',
          lead_campaign_data: [
            {
              campaign_id: 1,
              status: 'replied',
              replied: true,
              interested: false,
              bounced: false,
            },
          ],
        },
        {
          id: 2,
          first_name: 'User2',
          last_name: 'Test',
          email: 'user2@outlook.com',
          lead_campaign_data: [
            {
              campaign_id: 2,
              status: 'sent',
              replied: false,
              interested: false,
              bounced: false,
            },
          ],
        },
      ];

      const workspaceNames = new Map([
        [1, 'Google Workspace'],
        [2, 'Microsoft 365'],
      ]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      // Should have entries from both ESP types
      const googleToGmail = result.find(
        r => r.sending_esp === 'Google/Gmail' && r.receiving_domain_type === 'Gmail'
      );
      const outlookToOutlook = result.find(
        r => r.sending_esp === 'Outlook/Microsoft' && r.receiving_domain_type === 'Outlook'
      );

      expect(googleToGmail).toBeDefined();
      expect(outlookToOutlook).toBeDefined();
      expect(googleToGmail?.sending_esp).toBe('Google/Gmail');
      expect(outlookToOutlook?.sending_esp).toBe('Outlook/Microsoft');
    });
  });

  describe('calculation accuracy', () => {
    it('should calculate reply rate correctly', () => {
      const campaigns: Campaign[] = [
        {
          id: 1,
          name: 'Campaign',
          workspace_id: 1,
          status: 'completed',
          emails_sent: 100,
          bounced: 10,
          unique_replies: 9,
          interested: 5,
          unsubscribed: 0,
          total_leads_contacted: 100,
          created_at: '2025-01-01',
          updated_at: '2025-01-10',
        },
      ];

      const leads: Lead[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        first_name: `User${i}`,
        last_name: 'Test',
        email: `user${i}@gmail.com`,
        lead_campaign_data: [
          {
            campaign_id: 1,
            status: i < 10 ? 'bounced' : i < 19 ? 'replied' : 'sent',
            replied: i >= 10 && i < 19,
            interested: false,
            bounced: i < 10,
          },
        ],
      }));

      const workspaceNames = new Map([[1, 'Google Workspace']]);

      const result = buildESPMatrix(campaigns, leads, workspaceNames);

      const entry = result[0];
      expect(entry.total_sent).toBe(100);
      expect(entry.total_bounced).toBe(10);
      expect(entry.total_delivered).toBe(90);
      expect(entry.total_replies).toBe(9);
      expect(entry.reply_rate).toBe(10); // 9/90 * 100 = 10%
      expect(entry.bounce_rate).toBe(10); // 10/100 * 100 = 10%
    });
  });
});
