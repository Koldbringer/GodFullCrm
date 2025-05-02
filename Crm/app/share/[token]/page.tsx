import { notFound } from 'next/navigation';
import { getDynamicLink, recordDynamicLinkAccess } from '@/lib/services/dynamic-links';
import { PasswordProtection } from '@/components/share/password-protection';
import { ExpiredLink } from '@/components/share/expired-link';
import { OfferView } from '@/components/share/offer-view';
import { ContractView } from '@/components/share/contract-view';
import { FormView } from '@/components/share/form-view';
import { ReportView } from '@/components/share/report-view';
import { InvoiceView } from '@/components/share/invoice-view';
import { ServiceOrderView } from '@/components/share/service-order-view';
import { CustomerPortalView } from '@/components/share/customer-portal-view';
import { DocumentView } from '@/components/share/document-view';
import { CustomView } from '@/components/share/custom-view';

export const dynamic = 'force-dynamic';

export default async function SharedLinkPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const link = await getDynamicLink(token);
  
  // If link doesn't exist, return 404
  if (!link) {
    return notFound();
  }
  
  // Check if link is expired
  const now = new Date();
  const expiresAt = new Date(link.expires_at);
  const isExpired = now > expiresAt;
  
  // Check if link is active
  if (!link.is_active || isExpired) {
    return <ExpiredLink link={link} />;
  }
  
  // Record access (don't await to avoid blocking page load)
  recordDynamicLinkAccess(token).catch(console.error);
  
  // If password protected, show password form
  if (link.password_protected) {
    return <PasswordProtection token={token} />;
  }
  
  // Render appropriate view based on link type
  switch (link.link_type) {
    case 'offer':
      return <OfferView link={link} />;
    case 'contract':
      return <ContractView link={link} />;
    case 'form':
      return <FormView link={link} />;
    case 'report':
      return <ReportView link={link} />;
    case 'invoice':
      return <InvoiceView link={link} />;
    case 'service_order':
      return <ServiceOrderView link={link} />;
    case 'customer_portal':
      return <CustomerPortalView link={link} />;
    case 'document':
      return <DocumentView link={link} />;
    case 'custom':
      return <CustomView link={link} />;
    default:
      return notFound();
  }
}
