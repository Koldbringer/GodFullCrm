"use client";

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { useMemo, useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { pl } from 'date-fns/locale';
import { addHours, startOfDay, endOfDay } from 'date-fns';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import EventFormModal from "@/components/calendar/EventFormModal";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import axios from 'axios';

// Helper to localize react-big-calendar with date-fns
const localizer = dateFnsLocalizer({
  formats: {
    dateFormat: 'dd',
    dayFormat: 'eee dd.MM',
    weekdayFormat: 'eeee',
    monthHeaderFormat: 'LLLL yyyy',
    dayHeaderFormat: 'eeee, dd.MM.yyyy',
    dayRangeHeaderFormat: (
      { start, end }: { start: Date; end: Date },
      culture: string,
      local: any
    ) => `${format(start, 'dd.MM.yyyy', { locale: pl })} – ${format(end, 'dd.MM.yyyy', { locale: pl })}`,
    agendaHeaderFormat: (
      { start, end }: { start: Date; end: Date },
      culture: string,
      local: any
    ) => `${format(start, 'dd.MM.yyyy', { locale: pl })} – ${format(end, 'dd.MM.yyyy', { locale: pl })}`,
    agendaDateFormat: 'dd.MM',
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: (
      { start, end }: { start: Date; end: Date },
      culture: string,
      local: any
    ) => `${format(start, 'HH:mm', { locale: pl })} – ${format(end, 'HH:mm', { locale: pl })}`,
    timeGutterFormat: 'HH:mm',
  },
  firstDayOfWeek: 1,
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { pl },
});

export type EventType = 'service' | 'installation' | 'inspection';

export type CalendarEvent = {
  id: string;
  title: string;
  start?: Date | null;
  end?: Date | null;
  type: EventType;
  resource?: {
    customer: string;
    technician: string;
    site: string; // Corresponds to location
    device: string;
    status: string;
    description: string;
  };
};

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Serwis klimatyzacji',
    start: addHours(startOfDay(new Date()), 9),
    end: addHours(startOfDay(new Date()), 11),
    type: 'service',
    resource: {
      customer: 'Adam Bielecki',
      technician: 'Piotr Nowak',
      site: 'Biuro główne',
      device: 'Mitsubishi Electric MSZ-AP25VG',
      status: 'Zaplanowana',
      description: '', // Added description
    },
  },
  {
    id: '2',
    title: 'Montaż pompy ciepła',
    start: addHours(startOfDay(new Date()), 12),
    end: addHours(startOfDay(new Date()), 16),
    type: 'installation',
    resource: {
      customer: 'Celina Dąbrowska',
      technician: 'Marek Kowalski',
      site: 'Dom jednorodzinny',
      device: 'Daikin Altherma 3 ERGA04DV',
      status: 'Zaplanowana',
      description: '', // Added description
    },
  },
  {
    id: '3',
    title: 'Oględziny inwestycji',
    start: addHours(startOfDay(new Date()), 17),
    end: addHours(startOfDay(new Date()), 18),
    type: 'inspection',
    resource: {
      customer: 'Jan Nowak',
      technician: 'Anna Zielińska',
      site: 'Nowa inwestycja',
      device: '-',
      status: 'Zaplanowana',
      description: '', // Added description
    },
  },
];

const eventTypeColors: Record<EventType, string> = {
  service: 'bg-blue-500',
  installation: 'bg-green-500',
  inspection: 'bg-yellow-500',
};

const eventTypeLabels: Record<EventType, string> = {
  service: 'Serwis',
  installation: 'Montaż',
  inspection: 'Oględziny',
};

// Custom Toolbar for react-big-calendar
function CustomToolbar({ label, onNavigate, onView, view }: any) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <Button size="sm" variant="outline" onClick={() => onNavigate('TODAY')}>Dziś</Button>
        <Button size="sm" className="ml-2" variant="ghost" onClick={() => onNavigate('PREV')}>{'<'}</Button>
        <Button size="sm" variant="ghost" onClick={() => onNavigate('NEXT')}>{'>'}</Button>
      </div>
      <span className="font-bold text-lg">{label}</span>
      <div>
        <Button size="sm" variant={view === 'month' ? 'default' : 'outline'} onClick={() => onView('month')}>Miesiąc</Button>
        <Button size="sm" className="ml-2" variant={view === 'week' ? 'default' : 'outline'} onClick={() => onView('week')}>Tydzień</Button>
        <Button size="sm" className="ml-2" variant={view === 'day' ? 'default' : 'outline'} onClick={() => onView('day')}>Dzień</Button>
        <Button size="sm" className="ml-2" variant={view === 'agenda' ? 'default' : 'outline'} onClick={() => onView('agenda')}>Agenda</Button>
      </div>
    </div>
  );
}

const DnDCalendar = withDragAndDrop(Calendar);

function OutlookLoginButton() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup({
      scopes: ['User.Read', 'Calendars.ReadWrite'],
    });
  };

  return isAuthenticated ? null : (
    <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
      Zaloguj się do Outlook
    </button>
  );
}

async function fetchOutlookEvents(instance: any) {
  const result = await instance.acquireTokenSilent({
    scopes: ['Calendars.ReadWrite'],
  });
  const accessToken = result.accessToken;

  const { data } = await axios.get('https://graph.microsoft.com/v1.0/me/events', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.value.map((event: any) => ({
    id: event.id,
    title: event.subject,
    start: event.start?.dateTime ? new Date(event.start.dateTime) : null,
    end: event.end?.dateTime ? new Date(event.end.dateTime) : null,
    type: 'service',
    resource: {
      customer: event.organizer?.emailAddress?.name || '',
      technician: '',
      site: event.location?.displayName || '',
      device: '',
      status: event.showAs || '',
      description: event.bodyPreview || '',
    },
  }));
}

export default function BigCalendar() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [outlookEvents, setOutlookEvents] = useState<CalendarEvent[]>([]);
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOutlookEvents(instance).then(setOutlookEvents).catch(() => setOutlookEvents([]));
    }
  }, [isAuthenticated, instance]);

  const filteredEvents = useMemo(
    () => filter === 'all' ? events : events.filter(e => e.type === filter),
    [events, filter]
  );

  function handleAddEvent(data: any) {
    setEvents(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        title: data.title,
        start: data.startDate,
        end: data.endDate || data.startDate,
        type: data.type,
        resource: {
          customer: data.client,
          technician: data.technician,
          site: data.location,
          device: data.device,
          status: data.status,
          description: data.description,
        }
      }
    ])
  }

  function handleEventSelect(event: CalendarEvent) {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  }

  function handleDeleteEvent(eventId: string) {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setDetailsModalOpen(false);
  }

  function handleEditEvent(edited: CalendarEvent) {
    setModalOpen(true);
    setDetailsModalOpen(false);
    // Możesz dodać logikę edycji tutaj (np. przekazać event do modala edycji)
  }

  function handleEventDrop({ event, start, end }: any) {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === event.id ? { ...ev, start, end } : ev
      )
    );
  }

  function handleEventResize({ event, start, end }: any) {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === event.id ? { ...ev, start, end } : ev
      )
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-4 w-full h-[700px] flex flex-col">
      <OutlookLoginButton />
      {/* Legenda i filtry */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="font-semibold">Typ zdarzenia:</span>
        <button onClick={() => setFilter('all')} className={`px-2 py-1 rounded ${filter==='all' ? 'bg-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>Wszystkie</button>
        <button onClick={() => setFilter('service')} className={`px-2 py-1 rounded ${filter==='service' ? 'bg-blue-500 text-white' : 'bg-blue-100 dark:bg-blue-900 dark:text-blue-100'}`}>Serwis</button>
        <button onClick={() => setFilter('installation')} className={`px-2 py-1 rounded ${filter==='installation' ? 'bg-green-500 text-white' : 'bg-green-100 dark:bg-green-900 dark:text-green-100'}`}>Montaż</button>
        <button onClick={() => setFilter('inspection')} className={`px-2 py-1 rounded ${filter==='inspection' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-900'}`}>Oględziny</button>
        <button onClick={() => setModalOpen(true)} className="ml-auto bg-brand px-4 py-2 rounded text-white font-semibold shadow hover:bg-brand/80 flex-shrink-0">+ Dodaj wydarzenie</button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-auto">
        <DnDCalendar
          localizer={localizer as any}
          events={[...filteredEvents, ...outlookEvents]}
          startAccessor={(event) => (event as CalendarEvent).start || new Date()}
          endAccessor={(event) => (event as CalendarEvent).end || new Date()}
          style={{ height: '100%' }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.WEEK}
          popup
          messages={{
            today: 'Dziś',
            previous: 'Poprzedni',
            next: 'Następny',
            month: 'Miesiąc',
            week: 'Tydzień',
            day: 'Dzień',
            agenda: 'Agenda',
            showMore: (total: number) => `+${total} więcej`,
          }}
          components={{
            toolbar: CustomToolbar,
            event: ({ event }) => {
              const ev = event as CalendarEvent;
              return (
                <div className={`flex items-center gap-1 ${eventTypeColors[ev.type]} text-white rounded px-2 py-1 cursor-pointer flex-wrap min-w-0`} onClick={() => handleEventSelect(ev)} style={{ wordBreak: 'break-word', flex: '1 1 0%', minWidth: 0 }}>
                  <span className="text-xs font-bold whitespace-nowrap">{eventTypeLabels[ev.type]}</span>
                  <span className="truncate min-w-0 flex-1">
                    {ev.title}
                    {(!ev.start || !ev.end) && <span className="ml-2 text-xs italic">(czas opcjonalny)</span>}
                  </span>
                </div>
              );
            }
          }}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
        />
      </div>
      <EventFormModal open={modalOpen} setOpen={setModalOpen} onSubmit={handleAddEvent} />
      <EventDetailsModal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} event={selectedEvent} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
    </div>
  );
}
