import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessType, businessTypes } from '../config/businessTypes';

interface BusinessContextType {
  businessType: BusinessType;
  setBusinessType: (type: BusinessType) => void;
  terminology: BusinessType['terminology'];
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businessType, setBusinessType] = useState<BusinessType>(businessTypes[0]);

  const value = {
    businessType,
    setBusinessType,
    terminology: businessType.terminology,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}