// Mechanizm przypomnień o odnowieniu umów
import { sendEmail } from "@/lib/email";
import { getContractsExpiringSoon } from "@/lib/contracts";
import { createTask } from "@/lib/tasks";

export function sendRenewalReminders() {
  const contracts = getContractsExpiringSoon(30); // 30 dni przed wygaśnięciem
  contracts.forEach((contract: { id: string; customer: string; customerEmail: string; endDate: string }) => {
    sendEmail({
      to: contract.customerEmail,
      subject: "Przypomnienie o odnowieniu umowy",
      body: `Szanowny ${contract.customer},\n\nTwoja umowa ${contract.id} wygasa w dniu ${contract.endDate}. Prosimy o odnowienie.`,
    });
    // Tworzenie zadania w systemie
    createTask(`Odnów umowę ${contract.id}`);
  });
}