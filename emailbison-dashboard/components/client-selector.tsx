'use client';

import { useState } from 'react';
import { Client } from '@/lib/mock-data';

export interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: number | null;
  onSelect: (clientId: number | null) => void;
}

export function ClientSelector({
  clients,
  selectedClientId,
  onSelect,
}: ClientSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSelect(value === 'all' ? null : parseInt(value, 10));
  };

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="client-select"
        className="text-sm font-medium text-gray-700"
      >
        Select Client:
      </label>
      <select
        id="client-select"
        value={selectedClientId ?? 'all'}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm min-w-[250px]"
      >
        <option value="all">All Clients</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.display_name}
          </option>
        ))}
      </select>
    </div>
  );
}
