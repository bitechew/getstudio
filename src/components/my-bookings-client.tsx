"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, DollarSign, Tag, X, FileText, AlertTriangle, ArrowRight, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyBookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter handlers
  const filteredBookings = bookings.filter((b) => {
    if (filter === "All") return true;
    if (filter === "Active") return b.status === "PENDING" || b.status === "CONFIRMED";
    if (filter === "Past") return b.status === "COMPLETED";
    if (filter === "Cancelled") return b.status === "CANCELLED";
    return true;
  });

  const handleCancelClick = (id: string) => {
    setCancellingId(id);
    setError(null);
  };

  const confirmCancel = async (id: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel booking.");
        setIsSubmitting(false);
      } else {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
        );
        setIsSubmitting(false);
        setCancellingId(null);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      setIsSubmitting(false);
    }
  };

  const formatDisplayDate = (value: string) =>
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "border-amber-300 text-amber-700 bg-amber-50/20 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/10";
      case "CONFIRMED":
        return "border-green-300 text-green-700 bg-green-50/20 dark:border-green-700 dark:text-green-400 dark:bg-green-950/10";
      case "COMPLETED":
        return "border-blue-300 text-blue-700 bg-blue-50/20 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/10";
      case "CANCELLED":
        return "border-neutral-250 text-neutral-400 bg-neutral-50/20 dark:border-neutral-800 dark:text-neutral-500 dark:bg-neutral-900/10";
      default:
        return "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300";
    }
  };

  const isFutureBooking = (dateStr: string) => {
    const bookingDate = new Date(dateStr);
    const today = isHydrated ? new Date() : new Date("2000-01-01T00:00:00.000Z");
    today.setHours(0, 0, 0, 0);
    return bookingDate.getTime() >= today.getTime();
  };

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex space-x-2 border-b border-neutral-100 dark:border-neutral-900 pb-4">
        {["All", "Active", "Past", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition ${
              filter === f
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-850 rounded-2xl">
          <p className="text-sm font-light text-neutral-450 dark:text-neutral-500">
            No reservations found in this category.
          </p>
        </div>
      ) : (
        /* Grid list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            const canCancel =
              (booking.status === "PENDING" || booking.status === "CONFIRMED") &&
              isFutureBooking(booking.date);

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header details */}
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                      REF: {booking.id.substring(0, 8)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-wider uppercase ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <p className="flex items-center space-x-2">
                      <Calendar size={14} className="text-neutral-400 shrink-0" />
                      <strong className="text-neutral-850 dark:text-neutral-200">
                        {formatDisplayDate(booking.date)}
                      </strong>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Clock size={14} className="text-neutral-400 shrink-0" />
                      <span>
                        {booking.startTime} - {booking.endTime} ({booking.duration})
                      </span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <DollarSign size={14} className="text-neutral-400 shrink-0" />
                      <span>Cost: Rp {booking.price.toLocaleString("id-ID")}</span>
                    </p>
                  </div>

                  {booking.notes && (
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-550 font-light italic truncate">
                      Notes: &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-900 pt-4 text-xs">
                  <button
                    onClick={() => setSelectedInvoice(booking)}
                    className="inline-flex items-center space-x-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                  >
                    <FileText size={12} />
                    <span>Invoice</span>
                  </button>

                  {canCancel && (
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20 rounded-full font-semibold tracking-wider text-[10px] uppercase transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Drawer Modal */}
      <AnimatePresence>
        {cancellingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-2xl max-w-sm w-full border border-neutral-100 dark:border-neutral-850 shadow-lg text-center space-y-4"
            >
              <div className="inline-flex p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Cancel Reservation?</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                Are you sure you want to cancel this booking? This action is irreversible. No charges will be billed for bookings cancelled 24 hours in advance.
              </p>

              {error && <p className="text-[10px] text-red-500">{error}</p>}

              <div className="flex space-x-3 pt-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => setCancellingId(null)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-600 dark:border-neutral-800 dark:text-neutral-300 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-neutral-50 dark:hover:bg-neutral-950 transition"
                >
                  No, Keep
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => confirmCancel(cancellingId)}
                  className="flex-1 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-sm"
                >
                  {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice receipt Overlay modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInvoice(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 p-8 rounded-2xl max-w-lg w-full border border-neutral-100 dark:border-neutral-850 shadow-xl space-y-6"
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <span className="font-serif text-sm font-bold tracking-widest text-neutral-950 dark:text-neutral-50">
                    GET<span className="font-sans text-[10px] font-light text-neutral-500 tracking-normal ml-0.5">STUDIO</span>
                  </span>
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-550 uppercase tracking-widest mt-1">Jakarta, Indonesia</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 font-light block uppercase tracking-wider text-[10px]">Reference Number</span>
                  <strong className="font-mono text-neutral-900 dark:text-white uppercase">{selectedInvoice.id}</strong>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 font-light block uppercase tracking-wider text-[10px]">Date Issued</span>
                  <strong className="text-neutral-900 dark:text-white">{formatDisplayDate(selectedInvoice.createdAt)}</strong>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl text-xs space-y-1 border border-neutral-100 dark:border-neutral-900">
                <span className="text-neutral-400 font-light block uppercase tracking-wider text-[9px]">Bill To:</span>
                <p className="font-semibold text-neutral-900 dark:text-white">{selectedInvoice.customerName}</p>
                <p className="text-neutral-550 dark:text-neutral-400 font-light">{selectedInvoice.customerEmail} | {selectedInvoice.customerPhone}</p>
              </div>

              {/* Bill items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between font-light">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Studio Booking Session</p>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500">
                      Date: {formatDisplayDate(selectedInvoice.date)} ({selectedInvoice.startTime} - {selectedInvoice.endTime})
                    </p>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500">Duration: {selectedInvoice.duration}</p>
                  </div>
                  <strong className="text-neutral-900 dark:text-white">Rp {selectedInvoice.price.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              {/* Total and Status */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-between items-center text-xs">
                <div>
                  <span className="text-neutral-400 font-light block uppercase tracking-wider text-[10px]">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase inline-block mt-1 ${getStatusStyle(selectedInvoice.status)}`}>
                    {selectedInvoice.status === "CANCELLED" ? "VOID" : "PAID (DEMO)"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 font-light block uppercase tracking-wider text-[10px]">Total Amount</span>
                  <strong className="text-xl font-bold font-serif text-neutral-900 dark:text-white">Rp {selectedInvoice.price.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              {/* Actions footer */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-end space-x-2 text-xs">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-950 transition flex items-center space-x-1.5"
                >
                  <Printer size={12} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
