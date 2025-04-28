import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from './BigCalendar'; // Assuming CalendarEvent type is defined here or needs to be created

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event, onEdit, onDelete }) => {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            Szczegóły wydarzenia
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <strong>Typ:</strong> {event.type}
          </div>
          <div>
            <strong>Daty:</strong> {event.start.toLocaleString()} - {event.end.toLocaleString()}
          </div>
          <div>
            <strong>Klient:</strong> {event.resource?.customer}
          </div>
          <div>
            <strong>Technik:</strong> {event.resource?.technician}
          </div>
          <div>
            <strong>Lokalizacja:</strong> {event.resource?.site}
          </div>
          <div>
            <strong>Urządzenie:</strong> {event.resource?.device}
          </div>
          <div>
            <strong>Status:</strong> {event.resource?.status}
          </div>
          <div>
            <strong>Opis:</strong> {event.resource?.description}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onEdit(event)}>Edytuj</Button>
          <Button variant="destructive" onClick={() => onDelete(event.id)}>Usuń</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
