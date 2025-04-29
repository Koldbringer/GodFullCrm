interface Contract {
  id: string;
  customer: string;
  customerEmail: string;
  endDate: string;
}

export function getContractsExpiringSoon(days: number): Contract[] {
  const today = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(today.getDate() + days);

  // Przykładowa implementacja, w rzeczywistości powinna być zintegrowana z bazą danych
  const contracts: Contract[] = [
    {
      id: '1',
      customer: 'Jan Kowalski',
      customerEmail: 'jan.kowalski@example.com',
      endDate: '2023-12-31',
    },
    {
      id: '2',
      customer: 'Anna Nowak',
      customerEmail: 'anna.nowak@example.com',
      endDate: '2023-11-30',
    },
  ];

  return contracts.filter(contract => {
    const contractEndDate = new Date(contract.endDate);
    return contractEndDate <= expirationDate && contractEndDate >= today;
  });
}