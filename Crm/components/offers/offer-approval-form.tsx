'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OfferApprovalFormProps {
  offerId: string;
  offerTitle: string;
}

export function OfferApprovalForm({ offerId, offerTitle }: OfferApprovalFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const router = useRouter();

  const handleSubmit = async (isApproved: boolean) => {
    setIsSubmitting(true);
    setApproved(isApproved);

    try {
      // Call API to update offer status
      const response = await fetch(`/api/offers/${offerId}/approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved: isApproved,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit approval');
      }

      toast.success(
        isApproved 
          ? 'Oferta została zaakceptowana!' 
          : 'Oferta została odrzucona.'
      );

      // Refresh the page after a short delay to show the success message
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error submitting approval:', error);
      toast.error('Wystąpił błąd podczas przetwarzania odpowiedzi');
      setApproved(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (approved !== null) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {approved ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-center">
            {approved ? 'Oferta zaakceptowana' : 'Oferta odrzucona'}
          </CardTitle>
          <CardDescription className="text-center">
            {approved
              ? 'Dziękujemy za akceptację oferty. Skontaktujemy się z Tobą wkrótce.'
              : 'Dziękujemy za informację. Skontaktujemy się z Tobą, aby omówić szczegóły.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Akceptacja oferty</CardTitle>
        <CardDescription>
          Prosimy o potwierdzenie akceptacji oferty: {offerTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Komentarz (opcjonalnie)
            </label>
            <Textarea
              id="comment"
              placeholder="Dodaj komentarz lub uwagi do oferty..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="w-[48%]"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Odrzuć
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          className="w-[48%]"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Akceptuję
        </Button>
      </CardFooter>
    </Card>
  );
}