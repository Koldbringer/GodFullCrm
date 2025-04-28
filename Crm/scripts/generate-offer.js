const fs = require('fs');
const path = require('path');

function generateOffer({ client, products, services, serviceJobs }) {
  // Tworzenie tabel
  const productsTable = products.map(
    p => `| ${p.name} | ${p.qty} | ${p.unitPrice} zł | ${p.total} zł |`
  ).join('\n');
  const servicesTable = services.map(
    s => `| ${s.name} | ${s.price} zł |`
  ).join('\n');
  const serviceTable = serviceJobs.map(
    s => `| ${s.name} | ${s.price} zł |`
  ).join('\n');

  // Suma
  const materialSum = products.reduce((s, p) => s + p.total, 0);
  const workSum = services.reduce((s, p) => s + p.price, 0);
  const serviceSum = serviceJobs.reduce((s, p) => s + p.price, 0);
  const totalSum = materialSum + workSum + serviceSum;

  // Szablon
  const mdx = `
---
title: Oferta dla ${client}
description: Oferta na usługi HVAC dla ${client}
---

# Oferta dla ${client}

## 1. Podsumowanie

Oferta przygotowana dla: **${client}**

## 2. Produkty

| Produkt       | Ilość | Cena jedn. netto | Wartość netto |
|---------------|-------|------------------|---------------|
${productsTable}

## 3. Wycena prac montażowych

| Usługa        | Cena netto |
|---------------|------------|
${servicesTable}

## 4. Serwis

| Usługa serwisowa | Cena netto |
|------------------|------------|
${serviceTable}

## 5. Podsumowanie

- Materiał: **${materialSum} zł netto**
- Robocizna: **${workSum} zł netto**
- Serwis: **${serviceSum} zł netto**

**Łącznie do zapłaty:** ${totalSum} zł netto

---
Oferta ważna 14 dni. Ceny nie zawierają VAT.
`;

  // Zapisz do pliku
  const filename = `oferta-${client.replace(/\s+/g, '-').toLowerCase()}.mdx`;
  fs.writeFileSync(path.join(__dirname, '../../kombajn/content/docs/', filename), mdx.trim());
  console.log('Oferta wygenerowana:', filename);
}

// PRZYKŁAD UŻYCIA:
generateOffer({
  client: 'Jan Kowalski',
  products: [
    { name: 'Klimatyzator LG', qty: 1, unitPrice: 2900, total: 2900 },
    { name: 'Pompa ciepła Daikin', qty: 1, unitPrice: 14500, total: 14500 },
    { name: 'Sterownik WiFi', qty: 2, unitPrice: 350, total: 700 }
  ],
  services: [
    { name: 'Montaż klimatyzatora', price: 1200 },
    { name: 'Montaż pompy ciepła', price: 3000 }
  ],
  serviceJobs: [
    { name: 'Przegląd klimatyzatora', price: 250 },
    { name: 'Dojazd', price: 0 }
  ]
});
