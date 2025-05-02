import AutomationEditor from '@/components/automation/AutomationEditor';
import React from 'react';

const AutomationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edytor Automatyzacji</h1>
      <AutomationEditor />
    </div>
  );
};

export default AutomationPage;