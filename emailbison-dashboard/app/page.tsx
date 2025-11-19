'use client';

import { useState } from 'react';
import { Card, Title, Text, Metric } from '@tremor/react';
import { ClientSelector } from '@/components/client-selector';
import { KPICard } from '@/components/kpi-card';
import {
  mockClients,
  getMockDataForClient,
  getAllMockData,
} from '@/lib/mock-data';

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Get data based on selected client
  const data = selectedClientId
    ? getMockDataForClient(selectedClientId)
    : getAllMockData();

  const { kpis, espPerformance } = data;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Title>EmailBison Analytics Dashboard</Title>
        <Text className="mt-2">
          Comprehensive email campaign analytics and performance insights
        </Text>
      </div>

      {/* Client Selector */}
      <div className="mb-8">
        <ClientSelector
          clients={mockClients}
          selectedClientId={selectedClientId}
          onSelect={setSelectedClientId}
        />
      </div>

      {/* Overview Section - KPI Cards */}
      <section className="mb-10">
        <Title className="mb-4">Overview</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Campaigns"
            value={kpis.totalCampaigns}
            colorClass="text-blue-600"
            description="Active and completed campaigns"
          />
          <KPICard
            title="Overall Reply Rate"
            value={kpis.overallReplyRate}
            unit="%"
            colorClass="text-green-600"
            description="Replies per delivered email"
            trend={{ value: 2.3, isPositive: true }}
          />
          <KPICard
            title="Overall Bounce Rate"
            value={kpis.overallBounceRate}
            unit="%"
            colorClass="text-yellow-600"
            description="Bounced per sent email"
            trend={{ value: -0.8, isPositive: false }}
          />
          <KPICard
            title="Engaged Leads"
            value={kpis.engagedLeads}
            colorClass="text-purple-600"
            description="Leads marked as interested"
            trend={{ value: 5.2, isPositive: true }}
          />
        </div>
      </section>

      {/* ESP Performance Section */}
      <section className="mb-10">
        <Card>
          <Title className="mb-4">ESP Performance</Title>
          <Text className="mb-6 text-gray-600">
            Reply and bounce rates by sending ESP and receiving domain
          </Text>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sending ESP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiving Domain
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounce Rate
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {espPerformance.map((row, idx) => {
                  // Color coding for grades
                  const gradeColors: Record<string, string> = {
                    'A+': 'bg-green-100 text-green-800',
                    'A': 'bg-green-50 text-green-700',
                    'B': 'bg-yellow-100 text-yellow-800',
                    'C': 'bg-orange-100 text-orange-800',
                    'D': 'bg-red-100 text-red-800',
                    'F': 'bg-red-200 text-red-900',
                  };

                  // Color coding for reply rate
                  const getReplyRateColor = (rate: number) => {
                    if (rate >= 12) return 'text-green-600 font-semibold';
                    if (rate >= 8) return 'text-yellow-600';
                    return 'text-gray-600';
                  };

                  // Color coding for bounce rate
                  const getBounceRateColor = (rate: number) => {
                    if (rate <= 2) return 'text-green-600';
                    if (rate <= 4) return 'text-yellow-600';
                    return 'text-red-600 font-semibold';
                  };

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.sending_esp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {row.receiving_domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        {row.volume.toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${getReplyRateColor(
                          row.reply_rate
                        )}`}
                      >
                        {row.reply_rate.toFixed(1)}%
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${getBounceRateColor(
                          row.bounce_rate
                        )}`}
                      >
                        {row.bounce_rate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            gradeColors[row.grade] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {row.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Conversion Funnel Section - Placeholder */}
      <section className="mb-10">
        <Card>
          <Title className="mb-4">Conversion Funnel</Title>
          <Text className="text-gray-600">
            Full funnel visualization from sends to meetings will be added in the next phase
          </Text>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.funnel.map((stage) => (
              <div key={stage.stage} className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="text-xs text-gray-500 uppercase">{stage.stage}</Text>
                <Metric className="text-blue-600 mt-2">{stage.count.toLocaleString()}</Metric>
                <Text className="text-xs text-gray-500 mt-1">
                  {stage.conversion_rate.toFixed(1)}%
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
